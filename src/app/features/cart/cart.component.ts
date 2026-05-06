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

  /**
   * Navega al perfil del usuario.
   * 
   * @returns void
   */
  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  /**
   * Vacía el carrito de compras, eliminando todos los productos que contiene.
   * 
   * @returns void
   */
  clearCart() {
    this.cartService.clearCart();
  }

  /**
   * Elimina un producto específico del carrito de compras, identificado por su índice en la lista de productos.
   * 
   * @param index Índice del producto a eliminar en el carrito.
   * @returns void
   */
  removeFromCart(index: number) {
    this.cartService.removeItem(index);
  }

  /**
   * Aumenta la cantidad de un producto específico en el carrito de compras, 
   * identificado por su índice en la lista de productos.
   * @param index  Índice del producto al que se le aumentará la cantidad en el carrito.
   * @returns void
   */
  increaseQuantity(index: number) {
    const items = [...this.getSnapshot()];
    items[index].quantity++;
    this.cartService.updateItem(index, items[index]);
  }

  /**
   * Disminuye la cantidad de un producto específico en el carrito de compras, identificado por su índice en la lista de productos.
   * Si la cantidad del producto es mayor a 1, se reduce en uno. 
   * Si la cantidad es igual a 1, se elimina el producto del carrito.
   * 
   * @param index Índice del producto al que se le disminuirá la cantidad en el carrito.
   * @returns void
   */
  decreaseQuantity(index: number) {
    const items = [...this.getSnapshot()];

    if (items[index].quantity > 1) {
      items[index].quantity--;
      this.cartService.updateItem(index, items[index]);
    } else {
      this.cartService.removeItem(index);
    }
  }

  /**
   * Calcula el total del carrito de compras sumando el precio de cada producto multiplicado por su cantidad.
   * @returns El total del carrito de compras como un número.
   */
  getTotal() {
    return this.cartService.getCartTotal();
  }
  /**
   * Indica si algún producto en el carrito de compras tiene una variante de color seleccionada.
   * @returns true si al menos un producto tiene una variante de color, false en caso contrario.
   */
  get hasColor(): boolean {
    return this.getSnapshot().some(item => item.color);
  }
  /**
   * Obtiene una instantánea de los productos actualmente en el carrito de compras.
   * Esto se hace para evitar problemas de suscripción al obtener el valor actual del carrito.
   * @returns Un array de productos actualmente en el carrito de compras.
   */
  private getSnapshot(): any[] {
    let value: any[] = [];
    this.cartItems$.subscribe(v => value = v).unsubscribe();
    return value;
  }

  /**
 * Realiza el proceso de compra, validando que el usuario esté autenticado, tenga una dirección de envío y haya seleccionado un método de pago.
 * 
 * @returns void
 */
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

    if (await this.cartService.checkout([...this.getSnapshot()], this.userAddresses[this.selectedAddress!], this.paymentMethod)) {
      this.notificationService.show("Compra realizada con éxito. ¡Gracias por tu compra!", "success");
      this.cartService.clearCart();
    } else {
      this.notificationService.show("Ha ocurrido un error durante el proceso de compra. Por favor, inténtelo de nuevo más tarde.", "error");
    }
  }

  /**
 * Inicializa el botón de PayPal cuando se selecciona ese método de pago.
 */
  selectPaypal(): void {
    this.paymentMethod = 'paypal';
    if (!this.userData) {
      this.notificationService.show("Debes iniciar sesión para realizar una compra.", "error");
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