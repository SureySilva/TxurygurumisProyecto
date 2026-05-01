import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf, TitleCasePipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { OrderService } from '../../../services/user/order.service';
import { ConfirmService } from '../../../services/messages/confirm.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, TitleCasePipe, NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {


  orders$: Observable<Order[]>;

  constructor(private orderService: OrderService, private confirmService: ConfirmService) {
    this.orders$ = this.orderService.getMyOrders();
  }

  /**
   * Devuelve la clase CSS según el estado del pedido.
   *
   * @param status Estado del pedido.
   * @returns Nombre de clase CSS.
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'status-pending';
      case 'confirmado':
        return 'status-paid';
      case 'enviado':
        return 'status-shipped';
      case 'recibido':
        return 'status-completed';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  received(id: string | undefined) {
    if (id) {
      this.confirmService.ask("¿Confirmar entrega?")
        .subscribe(async (ok) => {
          if (ok) {
            this.orderService.received({
              id: id,
              state: "recibido"
            });
          }
        });
    }
  }
}