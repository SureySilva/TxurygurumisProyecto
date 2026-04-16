import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, switchMap, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShippingAddress, UserProfile } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user/user.service';

/**
 * Componente de perfil de usuario.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  

  editNickname = false;
  nicknameDraft = '';

  showAddressForm = false;

  isSaving = false;
  errorMessage = '';
  successMessage = '';
  errorAddressMessage = '';
  successAddressMessage = '';

  editingAddressIndex: number | null = null;

  newAddress: ShippingAddress = this.getEmptyAddress();
  profile$!: Observable<UserProfile | null>;

  /**
   * Constructor del componente.
   *
   * @param authService Servicio de autenticación.
   * @param userProfileService Servicio de perfil.
   */
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    
}

  ngOnInit(): void {
    this.profile$ = this.authService.user$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(null);
      }

      return this.userService.getCurrentProfile();
    })

  );
  }

  /**
   * Activa el modo edición del nickname.
   *
   * @param profile Perfil actual.
   */
  startEditNickname(profile: UserProfile): void {
    this.nicknameDraft = profile.nickname;
    this.editNickname = true;
    this.clearMessages();
  }

  /**
   * Guarda el nickname mediante la Function.
   *
   * @returns Promesa de guardado.
   */
  async saveNickname(): Promise<void> {
    const nickname = this.nicknameDraft.trim();

    if (!nickname) {
      this.errorMessage = 'El nickname no puede estar vacío.';
      return;
    }

    this.isSaving = true;
    this.clearMessages();

    try {
      await this.userService.updateProfile({
        nickname
      });

      this.successMessage = 'Nickname actualizado correctamente.';
      this.editNickname = false;
    } catch (error: any) {
      this.errorMessage = error?.message ?? 'No se pudo actualizar el nickname.';
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Cancela la edición del nickname.
   */
  cancelNicknameEdit(): void {
    this.editNickname = false;
    this.nicknameDraft = '';
    this.clearMessages();
  }

  /**
   * Indica si se puede añadir una nueva dirección.
   *
   * @param profile Perfil actual.
   * @returns True si tiene menos de 2 direcciones.
   */
  canAddAddress(profile: UserProfile): boolean {
    return profile.addresses.length < 2;
  }

  /**
   * Abre el formulario de nueva dirección.
   */
  openAddressForm(): void {
    this.newAddress = this.getEmptyAddress();
    this.editingAddressIndex = null;
    this.showAddressForm = true;
    this.clearMessages();
  }

  
  /**
   * Cancela el formulario de dirección.
   */
  cancelAddressForm(): void {
    this.showAddressForm = false;
    this.editingAddressIndex = null;
    this.newAddress = this.getEmptyAddress();
    this.clearMessages();
  }

  /**
   * Guarda una nueva dirección usando la Function.
   *
   * @param profile Perfil actual.
   * @returns Promesa de guardado.
   */
  async saveAddress(profile: UserProfile): Promise<void> {
    if (!this.isAddressValid(this.newAddress)) {
    this.errorMessage = 'Todos los campos de la dirección son obligatorios.';
    return;
  }

  this.isSaving = true;
  this.clearMessages();

  try {
    const updatedAddresses = [...(profile.addresses ?? [])];

    if (this.editingAddressIndex === null) {
      if (updatedAddresses.length >= 2) {
        this.errorMessage = 'Solo se permiten 2 direcciones.';
        this.isSaving = false;
        return;
      }

      updatedAddresses.push({ ...this.newAddress });
    } else {
      updatedAddresses[this.editingAddressIndex] = { ...this.newAddress };
    }

    await this.userService.updateProfile({
      addresses: updatedAddresses
    });

    this.successAddressMessage =
      this.editingAddressIndex === null
        ? 'Dirección guardada correctamente.'
        : 'Dirección actualizada correctamente.';

    this.showAddressForm = false;
    this.editingAddressIndex = null;
    this.newAddress = this.getEmptyAddress();
  } catch (error: any) {
    this.errorAddressMessage = error?.message ?? 'No se pudo guardar la dirección.';
  } finally {
    this.isSaving = false;
  }
  }

async removeAddress(profile: UserProfile, index: number): Promise<void> {
  this.isSaving = true;
  this.clearMessages();

  try {
    const updatedAddresses = [...(profile.addresses ?? [])];
    updatedAddresses.splice(index, 1);

    await this.userService.updateProfile({
      addresses: updatedAddresses
    });

    this.successAddressMessage = 'Dirección eliminada correctamente.';

    if (this.editingAddressIndex === index) {
      this.cancelAddressForm();
    }
  } catch (error: any) {
    this.errorAddressMessage = error?.message ?? 'No se pudo eliminar la dirección.';
  } finally {
    this.isSaving = false;
  }
}

  /**
   * Abre el formulario de edición para una dirección existente.
   * @param index  Índice de la dirección a editar.
   * @param address   Dirección a editar.
   */
  startEditAddress(index: number, address: ShippingAddress): void {
  this.newAddress = { ...address };
  this.editingAddressIndex = index;
  this.showAddressForm = true;
  this.clearMessages();
}



  /**
   * Devuelve una dirección vacía.
   *
   * @returns Dirección inicial vacía.
   */
  private getEmptyAddress(): ShippingAddress {
    return {
      name: '',
      fullName: '',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      phone: ''
    };
  }

  /**
   * Valida que todos los campos de una dirección estén completos.
   *
   * @param address Dirección a validar.
   * @returns True si es válida.
   */
  private isAddressValid(address: ShippingAddress): boolean {
    return !!(
      address.name.trim() &&
      address.fullName.trim() &&
      address.street.trim() &&
      address.city.trim() &&
      address.postalCode.trim() &&
      address.country.trim() &&
      address.phone.trim()
    );
  }

  /**
   * Limpia mensajes de estado.
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.errorAddressMessage = '';
    this.successAddressMessage = '';
  }
}