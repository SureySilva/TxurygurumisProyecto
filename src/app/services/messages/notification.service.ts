import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  text: string;
  type: ToastType;
}

/**
 * Servicio global de notificaciones tipo toast.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$ = this.toastSubject.asObservable();
  private timeoutId?: ReturnType<typeof setTimeout>;

  /**
   * Muestra una notificación.
   *
   * @param text Texto del mensaje.
   * @param type Tipo de notificación.
   * @returns void
   */
  public show(text: string, type: ToastType = 'info'): void {
    this.toastSubject.next(null); // limpia antes

    setTimeout(() => {
      this.toastSubject.next({ text, type });
    }, 50);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.toastSubject.next(null);
    }, 4000);
  }

  /**
   * Oculta la notificación.
   *
   * @returns void
   */
  public clear(): void {
    this.toastSubject.next(null);
  }
}