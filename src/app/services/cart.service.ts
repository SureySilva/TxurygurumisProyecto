import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { httpsCallable, Functions } from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  private stockSub?: Subscription;

  private currentUser: any = null;

  constructor(private firestore: Firestore, private functions: Functions) { }

  /**
   * Inicializa el carrito al hacer login
   */
  async init(uid: string) {
    this.currentUser = uid;
    // 1. Intentar cargar desde cache local
    const local = localStorage.getItem(`cart_${uid}`);
    if (local) {
      this.cartSubject.next(JSON.parse(local));
    }

    // 2. Cargar desde Firestore (fuente de verdad)
    const ref = doc(this.firestore, 'carts', uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const items = data['items'] || [];

      this.cartSubject.next(items);

      // actualizar cache local
      localStorage.setItem(`cart_${uid}`, JSON.stringify(items));
    }
    this.listenCartStock();
  }
  /**
   * Carga el carrito de invitado al iniciar la app (si no hay usuario)
   */
  loadGuestCart() {
    const cart = JSON.parse(localStorage.getItem('cart_guest') || '[]');
    this.cartSubject.next(cart);
    this.listenCartStock();
  }

  /**
   * Vacía SOLO el estado (para logout)
   */
  clearCartState() {
    this.currentUser = null;
    this.cartSubject.next([]);
  }
  /**
   * Vacía todo (estado + Firestore + local) DESPUÉS de comprar o por completo
   */
  clearCart() {
    this.cartSubject.next([]);
    if (this.currentUser) {
      localStorage.removeItem(`cart_${this.currentUser}`);
      const ref = doc(this.firestore, 'carts', this.currentUser);
      setDoc(ref, { items: [] });
    }
    this.listenCartStock();
  }

  /**
   * Añadir producto
   */
  addItem(item: any) {
    const cart = [...this.cartSubject.value];
    cart.push(item);

    this.updateCart(cart);
    this.listenCartStock();
  }

  /**
   * Eliminar producto
   */
  removeItem(index: number) {
    const cart = [...this.cartSubject.value];
    cart.splice(index, 1);

    this.updateCart(cart);
    this.listenCartStock();
  }

  /**
   * Actualizar item
   */
  updateItem(index: number, item: any) {
    const cart = [...this.cartSubject.value];
    cart[index] = item;

    this.updateCart(cart);
    this.listenCartStock();
  }

  /**
   * Incrementar cantidad
   */
  increaseQuantity(index: number) {
    const cart = [...this.cartSubject.value];
    cart[index].quantity++;

    this.updateCart(cart);
  }

  /**
   * Decrementar cantidad
   */
  decreaseQuantity(index: number) {
    const cart = [...this.cartSubject.value];

    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }

    this.updateCart(cart);
    this.listenCartStock();
  }

  /**
   * Total carrito
   */
  getCartTotal(): number {
    // return this.cartSubject.value.reduce((total, item) => {
    //   return total + item.price * item.quantity;
    // }, 0);
    return this.cartSubject.value
      .filter(item => item.valid !== false)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }

  /**
   * Método centralizado
   */
  private updateCart(cart: any[]) {
    this.cartSubject.next(cart);
    this.saveCart(cart);
    this.listenCartStock();
  }

  /**
   * Guardado seguro (Firestore + local)
   */
  private async saveCart(cart: any[]) {
    if (!this.currentUser) {
      localStorage.setItem('cart_guest', JSON.stringify(cart));
      return;
    }

    // local cache
    localStorage.setItem(`cart_${this.currentUser}`, JSON.stringify(cart));
    // firestore
    const ref = doc(this.firestore, 'carts', this.currentUser);
    await setDoc(ref, {
      items: this.cartSubject.value
    });
  }
  /**
 * Fusiona carrito local con el de Firestore al hacer login
 */
  async mergeCartOnLogin(uid: string) {
    this.currentUser = uid;
    const localCart = JSON.parse(localStorage.getItem(`cart_guest`) || '[]');
    const ref = doc(this.firestore, 'carts', uid);
    const snap = await getDoc(ref);

    let firestoreCart: any[] = [];

    if (snap.exists()) {
      firestoreCart = snap.data()['items'] || [];
    }
    // 🔥 merge inteligente
    const mergedCart = this.mergeItems(localCart, firestoreCart);
    // guardar en Firestore
    try {
      await setDoc(ref, { items: mergedCart });
    } catch (e) {
      console.error("ERROR FIRESTORE:", e);
    }

    // actualizar estado
    this.cartSubject.next(mergedCart);

    // limpiar local
    localStorage.removeItem(`cart_guest`);
  }
  /**
   * Combina productos iguales sumando cantidades
   */
  private mergeItems(local: any[], remote: any[]): any[] {
    const map = new Map();

    [...remote, ...local].forEach(item => {
      const key = `${item.productId}_${item.color ?? ''}`;

      if (map.has(key)) {
        map.get(key).quantity += item.quantity;
      } else {
        map.set(key, { ...item });
      }
    });

    return Array.from(map.values());
  }

  async checkout(cart: any[], address: any, paymentMethod: string, paypalOrderId?: string): Promise<boolean> {

    this.listenCartStock();
    const validItems = this.cartSubject.value.filter(item => item.valid !== false);

    if (validItems.length === 0) {
      return false;
    }

    const callable = httpsCallable(this.functions, 'checkout');

    try {
      const result: any = await callable({
        items: validItems,
        address,
        paymentMethod,
        paypalOrderId
      });

      this.clearCart();
      return true;
    } catch (error) {
      return false;
    }
  }

  /** Obtiene los items del carrito */
  getCartItems() {
    return this.cartSubject.value;
  }

  /**
   * Escucha en tiempo real el stock de los productos del carrito.
   */
  listenCartStock(): void {

    if (this.stockSub) {
      this.stockSub.unsubscribe();
    }

    const cart = this.cartSubject.value;

    if (cart.length === 0) {
      return;
    }

    const productStreams = cart.map(item => {
      const productRef = doc(this.firestore, 'products', item.productId);
      return docData(productRef);
    });

    this.stockSub = combineLatest(productStreams).subscribe(products => {
      const updatedCart = cart.map((item, index) => {
        const product: any = products[index];

        if (!product) {
          return {
            ...item,
            valid: false,
            availableStock: 0,
            stockMessage: 'Producto no disponible'
          };
        }

        const variant = product.variants?.find(
          (v: any) => v.color === item.color
        );

        if (!variant || variant.stock <= 0) {
          return {
            ...item,
            valid: false,
            availableStock: 0,
            stockMessage: 'Producto agotado'
          };
        }

        if (item.quantity > variant.stock) {
          return {
            ...item,
            valid: false,
            availableStock: variant.stock,
            stockMessage: `Stock insuficiente. Disponible: ${variant.stock}`
          };
        }

        return {
          ...item,
          valid: true,
          availableStock: variant.stock,
          stockMessage: ''
        };
      });

      this.cartSubject.next(updatedCart);
    });
  }
}