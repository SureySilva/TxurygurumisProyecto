import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
/**
 * Array de proveedores para configurar Firebase en la aplicación Angular.
 * Incluye la inicialización de la aplicación, Firestore, Storage, Auth y Functions.
 * Cada proveedor utiliza una función de fábrica para crear la instancia correspondiente.
 */
export const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore()),
  provideStorage(() => getStorage()),
  provideAuth(() => getAuth()),
  provideFunctions(() => getFunctions())
];