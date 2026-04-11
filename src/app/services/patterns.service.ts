import { Injectable } from '@angular/core';
import { Pattern } from '../models/pattern.model';
import { combineLatest, map, Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PatternsService {
  

   constructor(private firestore: Firestore) { }
  
  getAll(): Observable<Pattern[]> {

  const patternsRef = collection(this.firestore, 'patterns');
  const galleryRef = collection(this.firestore, 'gallery');

  const patterns$ = collectionData(patternsRef, { idField: 'id' });
  const gallery$ = collectionData(galleryRef, { idField: 'id' });

  return combineLatest([patterns$, gallery$]).pipe(
    map(([patterns, gallery]: any[]) => {

      return patterns.map((pattern: any) => {

        const image = gallery.find((g: any) => g.title === pattern.title);

        return {
          ...pattern,
          imageUrl: image ? image.imageUrl : ''
        };

      });

    })
  );
}

getLatest(count: number = 2): Observable<Pattern[]> {
  return this.getAll().pipe(
    map(patterns => {
      // Ordena de mayor a menor id
      const sorted = [...patterns].sort((a, b) => (Number(b.id)) - (Number(a.id)));
      return sorted.slice(0, count); // toma los últimos N
    })
  );
}
getPattern(id: string | null): Observable<Pattern> {
    const productRef = doc(this.firestore, `patterns/${id}`);
    return docData(productRef, { idField: 'id' }) as Observable<Pattern>;
  }
}
