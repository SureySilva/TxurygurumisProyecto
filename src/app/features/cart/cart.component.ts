import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {


  cartItems$;
  showMessage = false;
  errorMessage = false;
  userData: any = null;

  constructor(private cartService: CartService, private userService: UserService) {
    this.cartItems$ = this.cartService.cart$;
  }
  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.userData = user;
    });
  }

  async purchase() {
    if (!this.userData) {
      alert("Debes iniciar sesión para realizar una compra.");
      return;
    }
    

    console.log("Usuario actual al comprar:", this.userData);

    // if(await this.cartService.checkout([...this.getSnapshot()])) {
    //   this.showMessage = true;
    //   setTimeout(() => {
    //         this.showMessage = false;
    //       }, 2000);
    // }else {
    //   this.errorMessage = true;
    //   setTimeout(() => {
    //         this.errorMessage = false;
    //       }, 2000);
    // }
  }

  clearCart() {
    this.cartService.clearCart();
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