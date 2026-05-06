import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ErrorHandleService } from '../../../services/messages/error-handle.service';

@Component({
  standalone: true,
  imports: [FormsModule,NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public email:string = '';
  public password: string = '';
  public error: string = '';
  public message: string = '';


  constructor(
    private auth: AuthService, 
    private router: Router,
    private errorHandler: ErrorHandleService
  ) {}

  
  /**
   * Inicia sesión con el correo electrónico y la contraseña proporcionados. 
   * Si el inicio de sesión es exitoso, redirige al usuario a la página principal. 
   * Si ocurre un error, muestra un mensaje de error utilizando el servicio de manejo de errores.
   */
  login() {
    
    this.auth.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']);
        
      })
      .catch(err => {
        this.error = this.errorHandler.getMessage(err);
        this.message = '';
      });
  }
  /**
   * Inicia sesión utilizando la autenticación de Google.
   * Si el inicio de sesión es exitoso, redirige al usuario a la página principal.
   * Si ocurre un error, muestra un mensaje de error genérico.
   */
  loginWithGoogle() {
    this.auth.logWithGoogle()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.error = 'Error al iniciar sesión con Google';
        this.message = '';
      });
  }
  /**
   * Envía un correo electrónico de verificación al correo proporcionado.
   * Si el envío es exitoso, muestra un mensaje de éxito. 
   * Si ocurre un error, muestra un mensaje de error genérico.
   */
  resendVerificationEmail() {
    this.auth.resendVerificationEmail(this.email)
      .then(() => {
        this.message = 'Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.';
        this.error = '';
      })
      .catch(err => {
        this.error = 'Error al reenviar el correo de verificación';
      });
  }
}