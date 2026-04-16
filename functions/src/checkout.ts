import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const checkout = onCall(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "Usuario no autenticado");
  }

  const items = request.data.items;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new HttpsError("invalid-argument", "Carrito vacío");
  }

  await db.runTransaction(async (tx) => {
    for (const item of items) {
      const ref = db.collection("shop").doc(item.productId);
      const snap = await tx.get(ref);

      if (!snap.exists) {
        throw new HttpsError("not-found", "Producto no existe");
      }

      const product = snap.data();
      const stock = product?.stock ?? 0;

      if (stock < item.quantity) {
        throw new HttpsError(
          "failed-precondition",
          `Stock insuficiente para ${item.title}`
        );
      }

      tx.update(ref, {
        stock: stock - item.quantity,
      });
    }

    const orderRef = db.collection("orders").doc();

    tx.set(orderRef, {
      uid,
      items,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return {success: true};
});
