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
  public showToast: boolean = false;

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
        console.log('Login correcto');
        this.router.navigate(['/']);
        
      })
      .catch(err => {
        console.log("Error login:", err);
        this.error = this.errorHandler.getMessage(err);
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
        console.log('Login con Google correcto');
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.error = 'Error al iniciar sesión con Google';
      });
  }
}