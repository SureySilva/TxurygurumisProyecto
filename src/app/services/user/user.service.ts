import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { getDoc, doc, Firestore, docData } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { ShippingAddress, UserProfile } from '../../models/user-profile.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  /**
   * Observable que indica si el usuario autenticado es administrador.
   */
  public isAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => user?.role === 'admin')
  );

  constructor(private functions: Functions, private firestore: Firestore,
    private auth: Auth, private authService: AuthService,
    ) {
    onAuthStateChanged(this.auth, async (userAuth) => {
      if (!userAuth) {
        this.currentUserSubject.next(null);
        return;
      }

      const userDoc = await getDoc(doc(this.firestore, "users", userAuth.uid));

      if (!userDoc.exists()) {
        this.currentUserSubject.next(null);
        return;
      }

      this.currentUserSubject.next(userDoc.data());
    });
  }

  /**
   *  Actualiza el perfil del usuario
   * @param data  Datos a actualizar (ej: { name: "Nuevo Nombre" })
   * @returns  Una promesa que se resuelve cuando la actualización es exitosa o se rechaza con un error.
   */
  updateUser(data: any) {
    const fn = httpsCallable(this.functions, 'updateUser');
    return fn(data);
  }

  /** Obtener datos del usuario actual de Firestore */
  getUser() {
    return this.currentUser$;
  }
  /**
   * Obtiene el perfil del usuario autenticado.
   *
   * @param uid Identificador del usuario.
   * @returns Observable con el perfil.
   */
  getProfile(uid: string): Observable<UserProfile> {
    const ref = doc(this.firestore, `users/${uid}`);
    return docData(ref, { idField: 'uid' }) as Observable<UserProfile>;
  }
  getCurrentProfile(): Observable<UserProfile | null> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }

        return this.getProfile(user.uid);
      })
    );
  }
  /**
   * Actualiza el perfil usando la Cloud Function.
   *
   * @param data Datos parciales del perfil.
   * @returns Promesa de actualización.
   */
  async updateProfile(data: {
    nickname?: string;
    addresses?: ShippingAddress[];
  }): Promise<void> {
    const callable = httpsCallable(this.functions, 'updateUser');
    await callable({ data });
  }

  async deleteAccount(): Promise<void> {
    const callable = httpsCallable(this.functions, 'deleteOwnAccount');

    await callable();

    await signOut(this.auth);
  }
}
