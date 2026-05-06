import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { CartService } from './cart.service';
import { ConfirmService } from './messages/confirm.service';
import { Router } from '@angular/router';
import { NotificationService } from './messages/notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;
  user:any;


  constructor(private auth: Auth, private functions: Functions, private firestore: Firestore,
    private router: Router, private cartService: CartService,
    private notificationService: NotificationService, private confirmService: ConfirmService
  ) {
    this.user$ = user(this.auth);
    onAuthStateChanged(this.auth, async (user) => {
      if (user?.uid) {
        await this.cartService.mergeCartOnLogin(user.uid);
      } else {
        this.cartService.loadGuestCart();
      }
    });
  }

  // Registro
  async createUserAccount(data: any) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      await setDoc(doc(this.firestore, "users", result.user.uid), {
        nickname: data.displayName,
        email: data.email,
        addresses: [],
        role: "user",
        createdAt: Date.now(),
      });
      // const fn = httpsCallable(this.functions, 'createUserAccount');
      if (this.auth.currentUser) {
        await sendEmailVerification(this.auth.currentUser);
        await signOut(this.auth);

        this.notificationService.show('Cuenta creada correctamente. Revisa tu correo para verificar tu cuenta.', 'success');
        this.router.navigate(['/']);
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
      this.user=user;
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
  logout(): void {
    //confirmar antes de cerrar sesión

    this.confirmService.ask("¿Seguro que quieres cerrar sesión?")
      .subscribe(async (ok) => {
        if (ok) {
          await signOut(this.auth);
          this.cartService.clearCartState();
          this.router.navigate(['/']);
        }
      });
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

  // Reenviar correo de verificación
  async resendVerificationEmail(email: string) {
    try {
      const user = this.user;
      if (user && user.email === email && !user.emailVerified) {
        await sendEmailVerification(user);
      } else {
        throw new Error("No se puede reenviar el correo de verificación");
      }
    } catch (error) {
      console.error("Error al reenviar el correo de verificación:", error);
      throw new Error("Error al reenviar el correo de verificación");
    } 
  }
}