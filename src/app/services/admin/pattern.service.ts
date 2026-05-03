import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Pattern } from '../../models/pattern.model';

/**
 * Servicio para gestionar patrones.
 */
@Injectable({
  providedIn: 'root'
})
export class PatternService {

  /**
   * Crea una instancia del servicio.
   *
   * @param firestore Instancia de Firestore.
   * @param storage Instancia de Firebase Storage.
   */
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  /**
   * Obtiene todos los patrones.
   *
   * @returns Observable con la lista de patrones.
   */
  public getPatterns(): Observable<Pattern[]> {
    const patternsRef = collection(this.firestore, "patterns");

    return collectionData(patternsRef, {
      idField: 'id'
    }) as Observable<Pattern[]>;
  }

  /**
   * Obtiene un patrón por id.
   *
   * @param id ID del patrón.
   * @returns Observable con el patrón.
   */
  public getPatternById(id: string): Observable<Pattern> {
    const patternRef = doc(this.firestore, `${"patterns"}/${id}`);

    return docData(patternRef, {
      idField: 'id'
    }) as Observable<Pattern>;
  }

  /**
   * Crea un patrón nuevo.
   *
   * @param pattern Datos del patrón.
   * @param file Imagen opcional.
   * @returns Promise<void>
   */
  public async createPattern(pattern: Pattern, file: File | null): Promise<void> {
    const patternToSave = {
      ...pattern,
      createdAt: serverTimestamp()
    };

    delete patternToSave.id;

    if (file) {
      const filePath: string = `images/${file.name}`;
      const storageRef = ref(this.storage, filePath);

      await uploadBytes(storageRef, file);

      patternToSave.imageUrl = await getDownloadURL(storageRef);
      patternToSave.storagePath = filePath;
    }

    const patternsRef = collection(this.firestore, "patterns");
    await addDoc(patternsRef, patternToSave);
  }

  /**
   * Actualiza un patrón existente.
   *
   * @param id ID del patrón.
   * @param pattern Datos actualizados.
   * @param file Nueva imagen opcional.
   * @returns Promise<void>
   */
  public async updatePattern(id: string, pattern: Pattern, file: File | null): Promise<void> {
    const patternRef = doc(this.firestore, `${"patterns"}/${id}`);

    const patternToUpdate = {
      ...pattern,
      updatedAt: serverTimestamp()
    };

    delete patternToUpdate.id;

    if (file) {
      const filePath: string = `patterns/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);

      await uploadBytes(storageRef, file);

      patternToUpdate.imageUrl = await getDownloadURL(storageRef);
      patternToUpdate.storagePath = filePath;
    }

    await updateDoc(patternRef, patternToUpdate);
  }

  /**
   * Elimina un patrón.
   *
   * @param id ID del patrón.
   * @returns Promise<void>
   */
  public async deletePattern(id: string): Promise<void> {
    const patternRef = doc(this.firestore, `${"patterns"}/${id}`);
    await deleteDoc(patternRef);
  }
}