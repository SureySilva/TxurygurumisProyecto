/**
 * Servicio para manejar errores de Firebase y funciones en la nube, 
 * proporcionando mensajes amigables para el usuario.
 * @author Surey Silva
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  constructor() { }
  private map: Record<string, string> = {
    "auth/email-already-in-use": "El email ya está registrado",
    "auth/invalid-email": "El email no es válido",
    "auth/invalid-credential": "Usuario o contraseña incorrectos",
    "auth/weak-password": "La contraseña es demasiado débil",
    "auth/user-not-found": "No existe el usuario",
    "auth/wrong-password": "Contraseña incorrecta",
    "functions/internal": "Error interno del servidor",
  };
  /**
   * Obtiene el mensaje de error correspondiente al código proporcionado
   * @param code código de error devuelto por Firebase o la función en la nube
   * @returns mensaje de error amigable para mostrar al usuario
   */
  getMessage(code: string): string {
    return this.map[code] || "Error inesperado";
  }
}
