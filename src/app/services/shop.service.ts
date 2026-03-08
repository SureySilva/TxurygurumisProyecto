import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private firestore: Firestore) { }

   getAll(): Observable<Product[]> {
    const ref = collection(this.firestore, 'shop');
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
  }
}