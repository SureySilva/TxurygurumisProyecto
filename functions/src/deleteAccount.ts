import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Elimina la cuenta del usuario autenticado y anonimiza sus pedidos.
 */
export const deleteOwnAccount = onCall(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError(
      "unauthenticated",
      "Debes iniciar sesión para eliminar tu cuenta."
    );
  }

  try {
    const userRef = db.doc(`users/${uid}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new HttpsError(
        "not-found",
        "No se encontró el perfil del usuario."
      );
    }

    const userData = userSnap.data();
    const isAdmin = userData?.["role"] === "admin";

    if (isAdmin) {
      const adminsSnapshot = await db
        .collection("users")
        .where("role", "==", "admin")
        .limit(2)
        .get();

      if (adminsSnapshot.size <= 1) {
        throw new HttpsError(
          "failed-precondition",
          "No puedes eliminar esta cuenta porque es el último administrador."
        );
      }
    }
    const batch = db.batch();
    const cartRef = db.doc(`carts/${uid}`);

    batch.delete(userRef);
    batch.delete(cartRef);

    const ordersSnapshot = await db
      .collection("orders")
      .where("uid", "==", uid)
      .get();

    ordersSnapshot.forEach((orderDoc) => {
      batch.update(orderDoc.ref, {
        uid: null,
        address: null,
        anonymized: true,
        anonymizedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    await admin.auth().deleteUser(uid);

    return {
      success: true,
      message: "Cuenta eliminada correctamente.",
    };
  } catch (error) {
    throw new HttpsError(
      "internal",
      "No se pudo eliminar la cuenta."
    );
  }
});
