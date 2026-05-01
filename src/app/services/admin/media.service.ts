import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MediaItem } from '../../models/media.model';


/**
 * Servicio para gestionar imágenes reutilizables.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  /**
   * Crea una instancia del servicio.
   *
   * @param firestore Instancia de Firestore.
   */
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene todas las imágenes reutilizables.
   *
   * @returns Observable con imágenes reutilizables.
   */
  public getAll(): Observable<MediaItem[]> {
    const mediaRef = collection(this.firestore, 'media');
    const mediaQuery = query(mediaRef, orderBy('createdAt', 'desc'));

    return collectionData(mediaQuery, {
      idField: 'id'
    }) as Observable<MediaItem[]>;
  }
}