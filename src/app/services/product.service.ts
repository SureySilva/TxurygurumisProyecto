import { Injectable } from '@angular/core';
import { Firestore, doc, docData, collection, collectionData, query, where, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Servicio encargado de obtener productos desde Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) {}

  /**
   * Devuelve todos los productos de la colección "products"
   */
  getProducts(): Observable<Product[]> {

    const productsRef = collection(this.firestore, 'shop');

    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;

  }

  /**
   * Obtiene un producto concreto por su id
   */
  getProduct(id: string): Observable<Product> {
    const productRef = doc(this.firestore, `shop/${id}`);
    return docData(productRef, { idField: 'id' }) as Observable<Product>;
  }

}