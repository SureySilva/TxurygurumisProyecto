import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { Firestore, collection, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { CartService } from './cart.service';
import { ConfirmService } from './confirm.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;


  constructor(private auth: Auth, private functions: Functions, private firestore: Firestore,
    private userService: UserService, private cartService: CartService, private confirmService: ConfirmService
  ) {
    this.user$ = user(this.auth);
    onAuthStateChanged(this.auth, (user) => {
       console.log("Auth state:", user);
    if (user?.uid) {
      this.cartService.init(user.uid);
    } else {
      this.cartService.clearCartState(); 
    }
  });
  }

  // Registro
  async createUserAccount(data: any) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      await setDoc(doc(this.firestore, "users", result.user.uid), {
        name: data.displayName,
        email: data.email,
        role: "user",
        createdAt: Date.now(),
      });
      // const fn = httpsCallable(this.functions, 'createUserAccount');
      if (this.auth.currentUser) {
        await sendEmailVerification(this.auth.currentUser);
      }
    } catch (err: any) {
      console.error("Error creando usuario:", err.code);
      throw new Error(err.code || "Error al crear la cuenta");
    }

  }

  // Login
  async login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(this.auth, email, password);

    const user = result.user;

    if (!user.emailVerified) {
      await signOut(this.auth);
      throw new Error("Verifica tu correo primero");
    }

  }

  //Login con Google
  async logWithGoogle() {
    const result = await signInWithPopup(
      this.auth,
      new GoogleAuthProvider()
    );
    // Obtenemos el token de ID para sincronizar el usuario en Firestore
    await result.user.getIdToken(true);

    const fn = httpsCallable(this.functions, 'syncUser');
    return await fn({});
  }
  // Logout
  logout() {
    //confirmar antes de cerrar sesión

  this.confirmService.ask("¿Seguro que quieres cerrar sesión?")
    .subscribe(async (ok) => {
      if (ok) {
        await signOut(this.auth);
        
      }
    });
  }

  // Función para actualizar el perfil del usuario
  updateUser(data: any) {
    const fn = httpsCallable(this.functions, 'updateUser');
    return fn(data);
  }

  //Recuperar contraseña
  async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      throw new Error("Error al enviar el correo de recuperación");
    }
  }
}