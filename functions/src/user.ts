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
export const createUserAccount = onCall(async (request) => {
  const {email, password, name} = request.data;

  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  await admin.firestore().collection("users").doc(userRecord.uid).set({
    name,
    email,
    createdAt: Date.now(),
  });

  return {uid: userRecord.uid};
});

