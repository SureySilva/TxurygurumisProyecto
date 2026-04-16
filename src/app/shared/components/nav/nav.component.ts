import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user/user.service';
import { ConfirmService } from '../../../services/confirm.service';
import { Auth, signOut } from '@angular/fire/auth';
import { CartService } from '../../../services/cart.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { UserProfile } from '../../../models/user-profile.model';
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
  constructor(private authService: AuthService, private userService: UserService,
    private router: Router, private auth: Auth, private cartService: CartService
  ) {
   this.profile$ = this.userService.getCurrentProfile();
  }
  
// ngOnInit() {
//   this.userService.currentUser$.subscribe(user => {
//     this.user = user;
//   });
// }



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


