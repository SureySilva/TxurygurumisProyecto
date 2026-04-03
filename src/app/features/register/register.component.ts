import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ErrorHandleService } from '../../services/error-handle.service';

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
  showMessage: boolean = false ;

  constructor(
    private userService: UserService,
    private errorHandler: ErrorHandleService
  ) { }



  async register() {
  try {
    await this.userService.createUserAccount({
      email: this.email,
      password: this.password,
      name: this.displayName,
    });

    this.success = true;

  } catch (err: any) {
    this.error = this.errorHandler.getMessage(err.code);
  }
}


}
