import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShippingAddress, UserProfile } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user/user.service';
import { ConfirmService } from '../../../services/messages/confirm.service';
import { NotificationService } from '../../../services/messages/notification.service';

/**
 * Componente de perfil de usuario.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FormsModule, RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {


  editNickname = false;
  nicknameDraft = '';

  showAddressForm = false;

  isSaving = false;

  editingAddressIndex: number | null = null;

  newAddress: ShippingAddress = this.getEmptyAddress();
  profile$!: Observable<UserProfile | null>;

  //**Mensaje emergente */
  public showToast = false;
  public toastMessage = '';
  public toastType: 'success' | 'error' = 'success';

  /**
   * Constructor del componente.
   *
   * @param authService Servicio de autenticación.
   * @param userProfileService Servicio de perfil.
   */
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private confirmService: ConfirmService,
    private router: Router,
    private notificationService: NotificationService,
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
  }

  /**
   * Guarda el nickname mediante la Function.
   *
   * @returns Promesa de guardado.
   */
  async saveNickname(): Promise<void> {
    const nickname = this.nicknameDraft.trim();

    if (!nickname) {
      this.notificationService.show('El nickname no puede estar vacío.', 'error');
      return;
    }

    this.isSaving = true;
    try {
      await this.userService.updateProfile({
        nickname
      });

      this.notificationService.show('Nickname actualizado correctamente.', 'success');
      this.editNickname = false;
    } catch (error: any) {
      this.notificationService.show(error?.message ?? 'No se pudo actualizar el nickname.', 'error');
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
  }


  /**
   * Cancela el formulario de dirección.
   */
  cancelAddressForm(): void {
    this.showAddressForm = false;
    this.editingAddressIndex = null;
    this.newAddress = this.getEmptyAddress();
  }

  /**
   * Guarda una nueva dirección usando la Function.
   *
   * @param profile Perfil actual.
   * @returns Promesa de guardado.
   */
  async saveAddress(profile: UserProfile): Promise<void> {
    if (!this.isAddressValid(this.newAddress)) {
      this.notificationService.show('Todos los campos son obligatorios.', 'error');
      return;
    }

    this.isSaving = true;
    try {
      const updatedAddresses = [...(profile.addresses ?? [])];

      if (this.editingAddressIndex === null) {
        if (updatedAddresses.length >= 2) {
          this.notificationService.show('Solo se permiten 2 direcciones.', 'error');
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
      
        this.editingAddressIndex === null
          ? this.notificationService.show('Dirección guardada correctamente.', 'success')
          : this.notificationService.show('Dirección actualizada correctamente.', 'success');

      this.showAddressForm = false;
      this.editingAddressIndex = null;
      this.newAddress = this.getEmptyAddress();
    } catch (error: any) {
      this.notificationService.show(error?.message ?? 'No se pudo guardar la dirección.', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async removeAddress(profile: UserProfile, index: number): Promise<void> {
    this.isSaving = true;

    try {
      const updatedAddresses = [...(profile.addresses ?? [])];
      updatedAddresses.splice(index, 1);

      await this.userService.updateProfile({
        addresses: updatedAddresses
      });

      this.notificationService.show('Dirección eliminada correctamente.', 'success');

      if (this.editingAddressIndex === index) {
        this.cancelAddressForm();
      }
    } catch (error: any) {
       this.notificationService.show( error?.message ?? 'No se pudo eliminar la dirección.', 'error');
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


  public deleteAccount(): void {
    this.confirmService.ask("¿Seguro que quieres eliminar la cuenta?")
      .subscribe(async (ok) => {
        if (ok) {
          try {
            await this.userService.deleteAccount();
            this.notificationService.show('Cuenta eliminada correctamente.', 'success');
            this.router.navigate(['/']);


          } catch (error: any) {

            if (error.code === 'functions/failed-precondition') {
              this.notificationService.show(
                'No puedes eliminar la cuenta porque es el último administrador.',
                'error'
              );
              return;
            }
            this.notificationService.show(
              'No se pudo eliminar la cuenta.',
              'error'
            );

          }
        }
      });

  }


}