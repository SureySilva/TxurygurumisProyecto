import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { doc, serverTimestamp, collection, addDoc, updateDoc, Firestore, deleteDoc } from '@angular/fire/firestore';
import { ref, uploadBytes, Storage, getDownloadURL } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {

  constructor(private firestore: Firestore, private storage: Storage) { }


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
      const filePath: string = `images/${Date.now()}-${file.name}`;
      const storageRef = ref(this.storage, filePath);

      await uploadBytes(storageRef, file);
      const downloadURL: string = await getDownloadURL(storageRef);
      productToSave.imageUrl = downloadURL;
      productToSave.storagePath = filePath;

      const mediaRef = collection(this.firestore, 'media');

      await addDoc(mediaRef, {
        imageUrl: downloadURL,
        storagePath: filePath,
        title: product.title,
        alt: product.alt,
        createdAt: serverTimestamp()
      });
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
      const mediaRef = collection(this.firestore, 'media');

      await addDoc(mediaRef, {
        imageUrl: productToUpdate.imageUrl,
        storagePath: productToUpdate.storagePath,
        title: productToUpdate.title,
        alt: productToUpdate.alt,
        createdAt: serverTimestamp()
      });
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
}
