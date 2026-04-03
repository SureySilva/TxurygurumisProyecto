import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, user, GoogleAuthProvider } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  // Registro
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //Login con Google
  logWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }
}