import { Injectable } from '@angular/core';

/**
 * Declara el objeto global de PayPal cargado desde el script del SDK.
 */
declare const paypal: any;

/**
 * Servicio encargado de renderizar y gestionar el botón de PayPal.
 */
@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  /**
   * Renderiza el botón de PayPal.
   *
   * @param containerId Id del contenedor HTML donde se dibujará el botón.
   * @param total Total del pedido.
   * @param onSuccess Función que se ejecuta cuando PayPal aprueba el pago.
   * @param onError Función que se ejecuta si PayPal devuelve un error.
   */
  renderPaypalButton(
    containerId: string,
    total: number,
    onSuccess: (paypalOrderId: string) => Promise<void>,
    onError: (error: any) => void
  ): void {
    paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: total.toFixed(2),
                currency_code: 'EUR'
              }
            }
          ]
        });
      },

      onApprove: async (_data: any, actions: any) => {
        await onSuccess(_data.orderID);
      },

      onError: (error: any) => {
        onError(error);
      }
    }).render(containerId);
  }
}