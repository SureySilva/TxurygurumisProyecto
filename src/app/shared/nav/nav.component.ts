import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user/user.service';
import { Auth, authState, User } from '@angular/fire/auth';
import { UserProfile } from '../../models/user-profile.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  isOpen: boolean = false;
  userMenuOpen: boolean = false;
  profile$!: Observable<UserProfile | null>;
  public authUser$: Observable<User | null>;
  public isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService, private userService: UserService,
    private auth: Auth  ) {
   this.profile$ = this.userService.getCurrentProfile();
    this.isAdmin$ = this.userService.isAdmin$;
    this.authUser$ = authState(this.auth);
  }
  

/**
 * Alterna el estado del menú de navegación.
 */
toggleMenu(): void {
  this.isOpen = !this.isOpen;
}
/**
 * Alterna el estado del menú de usuario.
 */
toggleUserMenu(): void {
  this.userMenuOpen = !this.userMenuOpen;
}
/**
 * Cierra los menús y llama al servicio de autenticación para cerrar la sesión del usuario.
 */
logout(): void {
  this.isOpen = false;
  this.userMenuOpen = false;
  this.authService.logout();
  
}
}


