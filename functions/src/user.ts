import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {sanitize, sanitizeObjectStrings} from "./utils/sanitize";
// Función para actualizar el perfil del usuario
export const updateUser = onCall(async (request) => {
  const uid = request.auth?.uid;
  const data = request.data.data as {
    nickname?: string;
    addresses?: {
      name: string;
      fullName: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
      phone: string;
    }[];
  };

  if (!uid) {
    throw new HttpsError("unauthenticated", "Usuario no autenticado");
  }

  if (data.nickname && data.nickname.length < 2) {
    throw new HttpsError("invalid-argument", "Nombre de usuario no válido");
  }

  const updateData: any = {};

  if (typeof data.nickname === "string") {
    updateData.nickname = data.nickname.trim();
  }

  if (data.nickname) updateData.nickname = sanitize(data.nickname);
  if (Array.isArray(data.addresses)) {
    const invalidAddress = data.addresses.some((address) =>
      !isValidObjectStrings(address));
    if (invalidAddress) {
      throw new HttpsError("invalid-argument", "Dirección no válida");
    }

    updateData.addresses = data.addresses.map(sanitizeObjectStrings);
  }

  await admin.firestore().collection("users").doc(uid).update(updateData);

  return {success: true};
});

const isValidObjectStrings = (obj: Record<string, unknown>): boolean => {
  return Object.values(obj).every(
    (value) => typeof value === "string" && value.trim().length > 0
  );
};

// Función para crear una cuenta de usuario con Google
export const syncUser = onCall(async (request) => {
  console.log("AUTH UID:", request.auth?.uid);
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "Usuario no autenticado");
  }

  const user = await admin.auth().getUser(uid);

  const userRef = admin.firestore().collection("users").doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      nickname: user.displayName || "Usuario",
      email: user.email,
      addresses: [],
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
      throw new HttpsError("unauthenticated", "Usuario no autenticado");
    }

    const uid = request.auth.uid;

    const doc = await admin.firestore().collection("users").doc(uid).get();

    if (!doc.exists) {
      throw new HttpsError("not-found", "Usuario no encontrado");
    }

    return doc.data();
  } catch (error: any) {
    console.error("ERROR getUserData:", error);
    throw new HttpsError("internal", "Error obteniendo usuario");
  }
});

