import {onCall} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {sanitize} from "./utils/sanitize";
// Función para actualizar el perfil del usuario
export const updateUser = onCall(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new Error("No autenticado");
  }

  const {name, address} = request.data;

  if (name && name.length < 2) {
    throw new Error("Nombre inválido");
  }

  if (address && address.length < 5) {
    throw new Error("Dirección inválida");
  }

  const updateData: any = {};

  if (name) updateData.name = sanitize(name);
  if (address) updateData.address = sanitize(address);

  await admin.firestore().collection("users").doc(uid).update(updateData);

  return {success: true};
});
// Función para crear una cuenta de usuario
// export const createUserAccount = onCall(async (request) => {
//   try {
//     const {email, password, name} = request.data;

//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//     });

//     await admin.firestore().collection("users").doc(userRecord.uid).set({
//       name,
//       email,
//       role: "user",
//       createdAt: Date.now(),
//     });

//     return {uid: userRecord.uid};
//   } catch (err: any) {
//     console.error("Error creando usuario:", err);
//     throw new Error(err.message || "Error al crear la cuenta");
//   }
// });
// Función para crear una cuenta de usuario con Google
export const syncUser = onCall(async (request) => {
  console.log("AUTH UID:", request.auth?.uid);
  const uid = request.auth?.uid;

  if (!uid) {
    throw new Error("No autenticado");
  }

  const user = await admin.auth().getUser(uid);

  const userRef = admin.firestore().collection("users").doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      name: user.displayName || "Usuario",
      email: user.email,
      role: "user",
      createdAt: Date.now(),
    });
  }

  return {success: true};
});

// Función para obtener el perfil del usuario
export const getUserData = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error("No autenticado");
    }

    const uid = request.auth.uid;

    const doc = await admin.firestore().collection("users").doc(uid).get();

    if (!doc.exists) {
      throw new Error("Usuario no encontrado");
    }

    return doc.data();
  } catch (error: any) {
    console.error("ERROR getUserData:", error);
    throw new Error(error.message || "Error obteniendo usuario");
  }
});
