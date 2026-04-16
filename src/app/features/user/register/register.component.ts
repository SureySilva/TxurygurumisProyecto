import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ErrorHandleService } from '../../../services/error-handle.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  displayName = '';
  email = '';
  password = '';
  confirmPassword = '';
  success = false;
  error = '';
  showMessage: boolean = false;

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandleService
  ) { }



  async register() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    if (this.password.length < 6 || this.password.length > 20) {
      this.error = 'La contraseña debe tener entre 6 y 20 caracteres';
      return;
    }
      this.auth.createUserAccount({
        email: this.email,
        password: this.password,
        displayName: this.displayName,
      }).then(() => {      
      this.showMessage = true;

    }).catch(err => {
        console.error("Error en registro:", err);
        this.error = this.errorHandler.getMessage(err.message);
        setTimeout(() => {
          this.error = '';
        }, 5000);
      });
  }
}
