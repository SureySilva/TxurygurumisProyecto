import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  
  isOpen: boolean = false;
  userMenuOpen: boolean = false;
  user$; 
  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.isOpen = false;
    this.userMenuOpen = false;
    this.authService.logout();
  }

}
