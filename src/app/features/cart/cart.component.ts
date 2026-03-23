import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgIf, NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems: any[] = [];

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();
  }
  purchase() {
    throw new Error('Method not implemented.');
  }
  removeFromCart(index: number) {
    this.cartService.removeItem(index);
    this.cartItems = this.cartService.getCartItems();
  }
  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
    this.cartService.updateItem(index, this.cartItems[index]);
    this.cartItems = this.cartService.getCartItems();
  }
  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.cartService.updateItem(index, this.cartItems[index]);
    }
    else{
      this.removeFromCart(index);
    }
    this.cartItems = this.cartService.getCartItems();
  }
  getTotal(): any {
    return this.cartService.getCartTotal();
  }

  get hasColor(): boolean {
  return this.cartItems?.some(item => item.color);
}
}
