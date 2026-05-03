import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/messages/notification.service';
import { PaypalService } from '../../services/paypal.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {


  cartItems$: Observable<any[]>;
  profile$: Observable<any>;
  userData: any = null;

  userAddresses: any[] = [];
  selectedAddress: number | null = null;
  paymentMethod: 'card' | 'paypal' = 'card';
  cardData = {
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  };

  constructor(private cartService: CartService, private userService: UserService,
    private router: Router, private notificationService: NotificationService,
    private paypalService: PaypalService
  ) {
    this.cartItems$ = this.cartService.cart$;
    this.profile$ = this.userService.getCurrentProfile();
  }

  ngOnInit(): void {
    this.userService.getCurrentProfile().subscribe(user => {
      this.userData = user;
      this.userAddresses = user?.addresses ?? [];

      if (this.userAddresses.length > 0) {
        this.selectedAddress = 0;
      }
    });
     this.cartService.listenCartStock();
    
  }

  async purchase() {
    if (!this.userData) {
      alert("Debes iniciar sesión para realizar una compra.");
      return;
    }

    if (!this.userAddresses.length) {
      this.notificationService.show("Debes agregar una dirección de envío para continuar.", "error");
      return;
    }

    if (this.selectedAddress === null && this.userAddresses.length >= 2) {
      this.notificationService.show("Debes seleccionar una dirección.", "error");
      return;
    }

    if (this.paymentMethod === 'card') {
      if (await this.cartService.checkout([...this.getSnapshot()], this.userAddresses[this.selectedAddress!], this.paymentMethod)) {
        this.notificationService.show("Compra realizada con éxito. ¡Gracias por tu compra!", "success");
        this.cartService.clearCart();      
      } else {
        this.notificationService.show("Ha ocurrido un error durante el proceso de compra. Por favor, inténtelo de nuevo más tarde.", "error");
      }
    }

    if (this.paymentMethod === 'paypal') {
      //window.location.href = '/paypal-demo';
    }

    console.log("Usuario actual al comprar:", this.userData);


  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
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

  /**
 * Inicializa el botón de PayPal cuando se selecciona ese método de pago.
 */
selectPaypal(): void {
  this.paymentMethod = 'paypal';

  setTimeout(() => {
    this.paypalService.renderPaypalButton(
      '#paypal-button-container',
      this.getTotal(),
      async (paypalOrderId: string) => {
        await this.finishPaypalCheckout(paypalOrderId);
      },
      (error: any) => {
        console.error('Error en PayPal:', error);
        this.notificationService.show(
          'Ha ocurrido un error con PayPal.',
          'error'
        );
      }
    );
  });
}

/**
 * Finaliza la compra después de que PayPal haya aprobado el pago.
 *
 * @param paypalOrderId Identificador del pago devuelto por PayPal.
 */
private async finishPaypalCheckout(paypalOrderId: string): Promise<void> {
  const ok = await this.cartService.checkout(
    [...this.getSnapshot()],
    this.userAddresses[this.selectedAddress!],
    'paypal',
    paypalOrderId
  );

  if (ok) {
    this.notificationService.show(
      'Pago con PayPal realizado con éxito. ¡Gracias por tu compra!',
      'success'
    );

    this.cartService.clearCart();
  } else {
    this.notificationService.show(
      'El pago se ha realizado, pero no se pudo crear el pedido.',
      'error'
    );
  }
}
}