import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotificationService, ToastMessage } from './services/messages/notification.service';
import { CommonModule, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavComponent, FooterComponent, NgIf, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TxurygurumisProyecto';
   /**
   * Toast global de la aplicación.
   */
 public toast$: Observable<ToastMessage | null>;

  /**
   * Crea una instancia del componente.
   *
   * @param notificationService Servicio de notificaciones.
   */
  constructor(private notificationService: NotificationService) {
    this.toast$ = this.notificationService.toast$;
  }
}
