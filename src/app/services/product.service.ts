import { Injectable } from '@angular/core';
import { Firestore, doc, docData, collection, collectionData, query, where, getDoc, addDoc, serverTimestamp, updateDoc, deleteDoc, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { getDownloadURL, ref, uploadBytes, Storage, deleteObject } from '@angular/fire/storage';

/**
 * Servicio encargado de obtener productos desde Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore, private storage: Storage) {}

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
   * Crea un producto y sube su imagen si existe.
   *
   * @param product Datos del producto.
   * @param file Archivo de imagen seleccionado.
   * @returns Promise<void>
   */
  public async createProduct(product: Product, file: File | null): Promise<void> {
    const productToSave = { ...product, createdAt: serverTimestamp() };

    if (file) {
      const filePath: string = `images/${file.name}`;
      const storageRef = ref(this.storage, filePath);

      await uploadBytes(storageRef, file);
      const downloadURL: string = await getDownloadURL(storageRef);
      productToSave.imageUrl = downloadURL;
      productToSave.storagePath = filePath;
    }

    const productsRef = collection(this.firestore, 'products');
    await addDoc(productsRef, productToSave);
  }

  /**
   * Actualiza un producto existente.
   *
   * @param id Identificador del producto.
   * @param product Producto actualizado.
   * @param file Nueva imagen opcional.
   * @returns Promise<void>
   */
  public async updateProduct(id: string, product: Product, file: File | null): Promise<void> {
    const productRef = doc(this.firestore, `products/${id}`);

    const productToUpdate = {
      ...product,
      updatedAt: serverTimestamp()
    };

    delete productToUpdate.id;

    if (file) {
      const filePath: string = `images/${file.name}`;
      const storageRef = ref(this.storage, filePath);

      await uploadBytes(storageRef, file);

      productToUpdate.imageUrl = await getDownloadURL(storageRef);
      productToUpdate.storagePath = filePath;
    }

    await updateDoc(productRef, productToUpdate);
  }

   /**
   * Elimina un producto.
   *
   * @param product Producto a eliminar.
   * @returns Promise<void>
   */
  public async deleteProduct(product: Product): Promise<void> {
    if (!product.id) {
      throw new Error('El producto no tiene id.');
    }

    const productRef = doc(this.firestore, `products/${product.id}`);
    await deleteDoc(productRef);

  }
  /**
   * Obtiene los productos visibles en la galería.
   *
   * @returns Observable con la lista de productos.
   */
  public getGalleryProducts(): Observable<Product[]> {
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
  public getStoreProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const storeQuery = query(productsRef, where('isForSale', '==', true));

    return collectionData(storeQuery, {
      idField: 'id'
    }) as Observable<Product[]>;
  }

  getLatest(count: number = 2): Observable<Product[]> {
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