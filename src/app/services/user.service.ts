import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { getDoc, doc, Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

private currentUserSubject = new BehaviorSubject<any>(null);
public currentUser$ = this.currentUserSubject.asObservable();

constructor(private functions: Functions, private firestore: Firestore, private auth: Auth) {
  onAuthStateChanged(this.auth, async (userAuth) => {
    if (!userAuth) {
      console.log("No hay usuario autenticado");
      this.currentUserSubject.next(null);
      return;
    }

    const userDoc = await getDoc(doc(this.firestore, "users", userAuth.uid));

    if (!userDoc.exists()) {
      console.log("No existe el documento del usuario en Firestore");
      this.currentUserSubject.next(null);
      return;
    }

    this.currentUserSubject.next(userDoc.data());
  });
}
}
