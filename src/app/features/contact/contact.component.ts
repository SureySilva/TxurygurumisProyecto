import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      // Marcar todos los campos como tocados para que se vean los errores
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    // Aquí puedes enviar los datos a un backend, Firebase, etc.
    console.log('Formulario enviado', form.value);

    this.submitted = true;

    // Limpiar formulario
    form.resetForm();

    // Ocultar mensaje de éxito después de unos segundos
    setTimeout(() => this.submitted = false, this.successMessageDuration);
  }

  onReset(form: NgForm) {
    form.resetForm();
    this.submitted = false;
  }
}