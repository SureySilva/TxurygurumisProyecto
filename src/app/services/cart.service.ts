import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = new BehaviorSubject<any[]>([]);
  cart$ = this.cartItems.asObservable();

  private storageKey = 'cart';

  init(userId: string): void {
    this.storageKey = `cart_${userId}`;
    this.loadCart();
  }

  addItem(item: any): void {
    const current = this.cartItems.value;
    const updated = [...current, item];

    this.cartItems.next(updated);
    this.saveCart(updated);
  }

  removeItem(index: number): void {
    const current = [...this.cartItems.value];
    current.splice(index, 1);

    this.cartItems.next(current);
    this.saveCart(current);
  }

  updateItem(index: number, item: any): void {
    const current = [...this.cartItems.value];
    current[index] = item;

    this.cartItems.next(current);
    this.saveCart(current);
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart([]);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce(
      (t, item) => t + item.price * item.quantity,
      0
    );
  }

  private saveCart(data: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    console.log('SAVE CART:', this.storageKey, data);
  }

  private loadCart(): void {
    const data = localStorage.getItem(this.storageKey);

    console.log('LOAD CART:', this.storageKey, data);

    this.cartItems.next(data ? JSON.parse(data) : []);
  }

  /** Obtiene los items del carrito */
  getCartItems() {
    return this.cartItems.value;
  }

  clearCartState() {
    this.cartItems.next([]); // ✅ no guarda nada
  }
}