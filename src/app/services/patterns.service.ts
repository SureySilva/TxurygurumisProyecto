import { Injectable } from '@angular/core';
import { Pattern } from '../models/pattern.model';
import { combineLatest, map, Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, limit, orderBy, query} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PatternsService {
  

   constructor(private firestore: Firestore) { }
  
  getAll(): Observable<Pattern[]> {

  const patternRef = collection(this.firestore, 'patterns');
      const ordersQuery = query(patternRef, orderBy('createdAt', 'desc'));
  
      return collectionData(ordersQuery, {
        idField: 'id'
      }) as Observable<Pattern[]>;
}

getLatest(count: number = 2): Observable<Pattern[]> {
  const patternsRef = collection(this.firestore, 'patterns');

  const q = query(
    patternsRef,
    orderBy('createdAt', 'desc'),
    limit(count)
  );

  return collectionData(q, { idField: 'id' }) as Observable<Pattern[]>;
}
getPattern(id: string | null): Observable<Pattern> {
    const productRef = doc(this.firestore, `patterns/${id}`);
    return docData(productRef, { idField: 'id' }) as Observable<Pattern>;
  }
}
