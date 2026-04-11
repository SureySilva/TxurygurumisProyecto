import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

     cartItems$;

  constructor(private cartService: CartService) {
     this.cartItems$ = this.cartService.cart$;
  }

  purchase() {
    throw new Error('Method not implemented.');
  }

  removeFromCart(index: number) {
    this.cartService.removeItem(index);
  }

  increaseQuantity(index: number) {
    const items = [...this.getSnapshot()];
    items[index].quantity++;
    this.cartService.updateItem(index, items[index]);
  }

  decreaseQuantity(index: number) {
    const items = [...this.getSnapshot()];

    if (items[index].quantity > 1) {
      items[index].quantity--;
      this.cartService.updateItem(index, items[index]);
    } else {
      this.cartService.removeItem(index);
    }
  }

  getTotal() {
    return this.cartService.getCartTotal();
  }

  get hasColor(): boolean {
    return this.getSnapshot().some(item => item.color);
  }

  private getSnapshot(): any[] {
    let value: any[] = [];
    this.cartItems$.subscribe(v => value = v).unsubscribe();
    return value;
  }
}