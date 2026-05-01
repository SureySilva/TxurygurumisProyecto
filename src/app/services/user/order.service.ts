import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData,
  query, where, orderBy,
  Timestamp,} from '@angular/fire/firestore';
import { httpsCallable, Functions } from '@angular/fire/functions';
import { Observable, of, switchMap } from 'rxjs';
import { Order } from '../../models/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
 

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private functions: Functions,
  ) {

  }

  /**
   * Obtiene los pedidos del usuario autenticado.
   *
   * @returns Observable con la lista de pedidos.
   */
  getMyOrders(): Observable<Order[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const ordersRef = collection(this.firestore, 'orders');
        const ordersQuery = query(
          ordersRef,
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        return collectionData(ordersQuery, { idField: 'id' }) as Observable<Order[]>;
      })
    );
  
  }
  /**
   * Actualiza el estado de un pedido a través de una 'functions' de firebase.
   * @param data Datos del pedido
   * @returns Respuesta de la función.
   */
   received(data: any) {
  
    const fn = httpsCallable(this.functions, 'updateOrder');
    return fn(data);
      
  }
}