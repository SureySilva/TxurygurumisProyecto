import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {logger} from "firebase-functions/v1";
import {defineSecret} from "firebase-functions/params";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const paypalClientId = defineSecret("PAYPAL_CLIENT_ID");
const paypalClientSecret = defineSecret("PAYPAL_CLIENT_SECRET");

const PAYPAL_API = "https://api-m.sandbox.paypal.com";
/**
 * Obtiene un token de acceso de PayPal.
 *
 * @return {Promise<string>} Token de acceso de PayPal.
 */
async function getPaypalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${paypalClientId.value()}:${paypalClientSecret.value()}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data: any = await response.json();

  if (!response.ok) {
    logger.error("Error obteniendo token PayPal", data);
    throw new HttpsError("internal", "No se pudo autenticar con PayPal");
  }

  return data.access_token;
}
/**
 * Captura una orden de PayPal y valida que el pago esté completado.
 *
 * @param {string} paypalOrderId Identificador de la orden de PayPal.
 * @return {Promise<PaypalCaptureResponse>} Respuesta de captura de PayPal.
 */
async function capturePaypalOrder(paypalOrderId: string): Promise<any> {
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data: any = await response.json();

  if (!response.ok) {
    logger.error("Error capturando orden PayPal", data);
    throw new HttpsError("failed-precondition", "Pago de PayPal no válido");
  }

  if (data.status !== "COMPLETED") {
    throw new HttpsError(
      "failed-precondition",
      "El pago de PayPal no se ha completado"
    );
  }

  return data;
}
export const checkout = onCall({secrets: [paypalClientId, paypalClientSecret]},
  async (request) => {
    try {
      const uid = request.auth?.uid;

      if (!uid) {
        throw new HttpsError("unauthenticated", "Usuario no autenticado");
      }

      const items = request.data.items;
      const address = request.data.address;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new HttpsError("invalid-argument", "Carrito vacío");
      }

      if (!address) {
        throw new HttpsError("invalid-argument",
          "Dirección de envío requerida");
      }

      const paymentMethod = request.data.paymentMethod ?? "card";
      const paypalOrderId = request.data.paypalOrderId ?? null;
      let paypalCapture = null;

      if (paymentMethod === "paypal") {
        if (!paypalOrderId) {
          throw new HttpsError(
            "invalid-argument",
            "Id de orden de PayPal requerido"
          );
        }

        paypalCapture = await capturePaypalOrder(paypalOrderId);
      }
      await db.runTransaction(async (tx) => {
        const productSnapshots: {
          item: any;
          ref: admin.firestore.DocumentReference;
          snap: admin.firestore.DocumentSnapshot;
        }[] = [];
        // Lectura de productos y referencias
        for (const item of items) {
          const ref = db.collection("products").doc(item.productId);
          const snap = await tx.get(ref);

          if (!snap.exists) {
            throw new HttpsError("not-found", "Producto no existe");
          }
          productSnapshots.push({item, ref, snap});
        }
        // Validaciones
        for (const entry of productSnapshots) {
          const product = entry.snap.data();
          const variants = product?.variants;

          if (!Array.isArray(variants)) {
            throw new HttpsError(
              "failed-precondition",
              `El producto ${entry.item.productId} no tiene variantes válidas`
            );
          }

          const variantIndex = variants.findIndex(
            (variant: any) => variant.color === entry.item.color
          );

          if (variantIndex === -1) {
            throw new HttpsError(
              "failed-precondition",
              `No existe la variante ${entry.item.color} 
                para ${entry.item.title}`
            );
          }

          const variant = variants[variantIndex];

          if (typeof variant.stock !== "number") {
            throw new HttpsError(
              "failed-precondition",
              `Stock inválido en la variante ${entry.item.color}`
            );
          }

          if (variant.stock < entry.item.quantity) {
            throw new HttpsError(
              "failed-precondition",
              `Stock insuficiente para ${entry.item.title} 
                (${entry.item.color})`
            );
          }
        }
        // Escritura de nuevo stock y creación de orden
        for (const entry of productSnapshots) {
          const product = entry.snap.data();
          const variants = product?.variants ?? [];

          const updatedVariants = variants.map((variant: any) => {
            if (variant.color === entry.item.color) {
              return {
                ...variant,
                stock: variant.stock - entry.item.quantity,
              };
            }

            return variant;
          });

          tx.update(entry.ref, {
            variants: updatedVariants,
          });
        }

        const orderRef = db.collection("orders").doc();
        const total = items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );
        tx.set(orderRef, {
          uid,
          state: paymentMethod === "paypal" ? "confirmado" : "pendiente",
          paymentMethod,
          payment: {
            method: paymentMethod,
            status: paymentMethod === "paypal" ? "paid" : "simulated",
            paypalOrderId,
            paypalStatus: paypalCapture?.status ?? null,
            paypalCaptureId:
              paypalCapture?.purchase_units?.[0]?.payments?.
                captures?.[0]?.id ?? null,
          },
          address,
          items,
          total,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      return {success: true};
    } catch (error: any) {
      logger.error("Error en checkout", error);

      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Error interno al procesar el pedido");
    }
  });

export const updateOrder = onCall(async (request) => {
  try {
    const uid = request.auth?.uid;

    if (!uid) {
      throw new HttpsError("unauthenticated", "Usuario no autenticado");
    }
    const orderId = request.data.id;
    const updateData: any = {};

    updateData.state = request.data.state;
    if (!orderId) {
      throw new HttpsError("invalid-argument", "Id del pedido requerida");
    }


    await admin.firestore().collection("orders")
      .doc(orderId).update(updateData);
    return {success: true};
  } catch (error: any) {
    logger.error("Error en checkout", error);

    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Error interno al actualizar el pedido");
  }
});
