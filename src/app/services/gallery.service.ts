import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { galleryItem } from '../models/gallery-item.model';
@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private firestore: Firestore) { }

   getAll(): Observable<galleryItem[]> {
    const ref = collection(this.firestore, 'gallery');
    return collectionData(ref, { idField: 'id' }) as Observable<galleryItem[]>;
  }
}
