import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  submitted = false;
   // Tiempo en ms que se muestra el mensaje de éxito
  successMessageDuration = 5000;
  errorMessageDuration = 5000;
  errorMessage="";
  
  constructor(private contactService: ContactService) {
    this.errorMessage = "";
  }

 
  

  onSubmit(form: NgForm) {
  if (!form.valid) {
    Object.values(form.controls).forEach(c => c.markAsTouched());
    return;
  }

  this.contactService.sendContact(form.value).subscribe({
    next: () => {
      this.submitted = true;
      form.resetForm();
      setTimeout(() => this.submitted = false, this.successMessageDuration);
    },
    error: (err) => {
      this.errorMessage = err.error?.error || "Error al enviar el mensaje";
      setTimeout(() => this.errorMessage = "", this.errorMessageDuration);
    }
  });
}

  

  onReset(form: NgForm) {
    form.resetForm();
    this.submitted = false;
  }
}