import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HomeContent } from '../../models/home-content.model';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private firestore: Firestore) { }
  /**
   * Obtiene el contenido de la home.
   */
  public getHomeContent(): Observable<HomeContent> {
    const ref = doc(this.firestore, 'siteContent/home');
    return docData(ref) as Observable<HomeContent>;
  }

  /**
   * Guarda el contenido editable de la home.
   *
   * @param content Contenido actualizado.
   * @returns Promise<void>
   */
  public saveHomeContent(content: HomeContent): Promise<void> {
    const homeRef = doc(this.firestore, 'siteContent/home');

    return setDoc(homeRef, content, { merge: true });
  }
}
