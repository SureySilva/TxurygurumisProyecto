import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Order, OrderState } from '../../../models/order.model';
import { OrderService } from '../../../services/admin/order.service';
import { CommonModule } from '@angular/common';


/**
 * Componente de administración de pedidos.
 */
@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent {
  /**
   * Lista completa de pedidos.
   */
  public orders$: Observable<Order[]>;

  /**
   * Filtro activo de estado.
   */
  private stateFilterSubject = new BehaviorSubject<OrderState | 'todos'>('todos');

  /**
   * Filtro activo como observable.
   */
  public stateFilter$ = this.stateFilterSubject.asObservable();

  /**
   * Pedidos filtrados por estado.
   */
  public filteredOrders$: Observable<Order[]>;

  /**
   * Estados disponibles para filtrar.
   */
  public states: Array<OrderState | 'todos'> = [
    'todos',
    'pendiente',
    'confirmado',
    'enviado',
    'recibido',
    'cancelado'
  ];

  /**
   * Crea una instancia del componente.
   *
   * @param orderService Servicio de pedidos.
   */
  constructor(private orderService: OrderService) {
    this.orders$ = this.orderService.getAllOrders();

    this.filteredOrders$ = combineLatest([
      this.orders$,
      this.stateFilter$
    ]).pipe(
      map(([orders, filter]) => {
        if (filter === 'todos') {
          return orders;
        }

        return orders.filter((order: Order) => order.state === filter);
      })
    );
  }

  /**
   * Cambia el filtro de estado.
   *
   * @param state Estado seleccionado.
   * @returns void
   */
  public setStateFilter(state: OrderState | 'todos'): void {
    this.stateFilterSubject.next(state);
  }

  /**
   * Indica si el admin puede cambiar el estado del pedido.
   *
   * @param order Pedido.
   * @returns true si puede actualizarse.
   */
  public canAdminUpdate(order: Order): boolean {
    return order.state !== 'recibido' && order.state !== 'cancelado';
  }

  /**
   * Devuelve los estados que puede asignar el admin.
   *
   * @param order Pedido.
   * @returns Lista de estados permitidos.
   */
  public getAvailableStates(order: Order): OrderState[] {
    if (order.state === 'pendiente') {
      return ['pendiente', 'confirmado', 'cancelado'];
    }

    if (order.state === 'confirmado') {
      return ['confirmado', 'enviado', 'cancelado'];
    }

    if (order.state === 'enviado') {
      return ['enviado'];
    }

    return [order.state];
  }

  /**
   * Actualiza el estado de un pedido.
   *
   * @param order Pedido a actualizar.
   * @param event Evento del select.
   * @returns Promise<void>
   */
  public async updateState(order: Order, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const newState = select.value as OrderState;

    if (!order.id) {
      return;
    }

    try {
      await this.orderService.updateOrderState(order.id, newState);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  }
}