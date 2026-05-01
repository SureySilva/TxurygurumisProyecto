import { Timestamp } from '@angular/fire/firestore';

/**
 * Representa una imagen reutilizable del proyecto.
 */
export interface MediaItem {
  id?: string;
  title: string;
  imageUrl: string;
  storagePath: string;
  createdAt?: Timestamp;
}