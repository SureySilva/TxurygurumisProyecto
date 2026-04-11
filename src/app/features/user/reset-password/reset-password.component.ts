import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [NgIf, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  email = '';
  error: string = '';
  success: string = '';

  constructor( private auth: AuthService) { }

  resetPassword() {
   try{
    this.auth.sendPasswordResetEmail(this.email);
    this.success = "Se ha enviado un correo con el enlace para restablecer tu contraseña.";
   }catch(err){
    console.error("Error al enviar el correo de recuperación:", err);
    this.error = "Error al enviar el correo de recuperación";
   }
  }

}
