import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 

  private cartItems = new BehaviorSubject<any[]>([]);

  cart$ = this.cartItems.asObservable();

  /**
   * Añade item al carrito
   */
  addItem(item: any): void {

    const current = this.cartItems.value;

    this.cartItems.next([...current, item]);
  }

  /** Elimina item del carrito */
  removeItem(index: number): void {
    const current = this.cartItems.value;
    current.splice(index, 1);
    this.cartItems.next([...current]);
  }

  /** Limpia el carrito */
  clearCart(): void {
    this.cartItems.next([]);
  }

  /** Obtiene el total del carrito */
  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
 /** Obtiene los items del carrito */
  getCartItems() {
    return this.cartItems.value;
  }

   updateItem(index: number, item: any) {
    const current = this.cartItems.value;
    current[index] = item;
    this.cartItems.next([...current]);
  }
}