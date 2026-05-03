import { Timestamp } from "@angular/fire/firestore";


/**
 * Interfaz de un item de pedido.
 */
export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

/**
 * Interfaz de dirección de pedido.
 */
export interface OrderAddress {
  name?: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

/**
 * Interfaz de pedido.
 */
export interface Order {
  id?: string;
  uid: string;
  orderNumber: string;
  state: OrderState;
  paymentMethod: 'card' | 'paypal';
  total: number;
  items: OrderItem[];
  address: OrderAddress;
  createdAt: Timestamp;
}

export type OrderState =
  | 'pendiente'
  | 'confirmado'
  | 'enviado'
  | 'recibido'
  | 'cancelado';
