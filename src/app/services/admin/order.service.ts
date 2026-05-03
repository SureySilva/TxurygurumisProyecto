import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order, OrderState } from '../../models/order.model';


/**
 * Servicio para gestionar pedidos.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  /**
   * Crea una instancia del servicio.
   *
   * @param firestore Instancia de Firestore.
   */
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene todos los pedidos ordenados por fecha.
   *
   * @returns Observable con todos los pedidos.
   */
  public getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(ordersQuery, {
      idField: 'id'
    }) as Observable<Order[]>;
  }

  /**
   * Actualiza el estado de un pedido.
   *
   * @param orderId ID del pedido.
   * @param state Nuevo estado.
   * @returns Promise<void>
   */
  public updateOrderState(orderId: string, state: OrderState): Promise<void> {
    const orderRef = doc(this.firestore, `orders/${orderId}`);

    return updateDoc(orderRef, {
      state
    });
  }
}