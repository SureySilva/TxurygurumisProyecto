import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { ShippingAddress, UserProfile } from '../../models/user-profile.model';

/**
 * Servicio de gestión del perfil del usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  /**
   * Constructor del servicio.
   *
   * @param firestore Instancia de Firestore.
   * @param functions Instancia de Firebase Functions.
   */
  constructor(
    private firestore: Firestore,
    private functions: Functions
  ) {}

  
}