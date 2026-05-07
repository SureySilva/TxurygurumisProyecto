import { Injectable } from '@angular/core';
import { Firestore, doc, docData, collection, collectionData, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Servicio encargado de obtener productos desde Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) { }

  /**
   * Devuelve todos los productos de la colección "products"
   */
  getProducts(): Observable<Product[]> {

    const productsRef = collection(this.firestore, 'products');

    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;

  }

  /**
   * Obtiene un producto concreto por su id
   */
  getProduct(id: string): Observable<Product> {
    const productRef = doc(this.firestore, `products/${id}`);
    return docData(productRef, { idField: 'id' }) as Observable<Product>;
  }


  /**
   * Obtiene los productos visibles en la galería.
   *
   * @returns Observable con la lista de productos.
   */
  public getGalleryProducts(): Observable < Product[] > {
  const productsRef = collection(this.firestore, 'products');
  const galleryQuery = query(productsRef, where('showInGallery', '==', true));

  return collectionData(galleryQuery, {
    idField: 'id'
  }) as Observable<Product[]>;
}

  /**
   * Obtiene los productos que están a la venta.
   *
   * @returns Observable con la lista de productos en tienda.
   */
  public getStoreProducts(): Observable < Product[] > {
  const productsRef = collection(this.firestore, 'products');
  const storeQuery = query(productsRef, where('isForSale', '==', true));

  return collectionData(storeQuery, {
    idField: 'id'
  }) as Observable<Product[]>;
}

getLatest(count: number = 2): Observable < Product[] > {
  const patternsRef = collection(this.firestore, 'products');

  const q = query(
    patternsRef,
    where('isForSale', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  );

  return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
}

}