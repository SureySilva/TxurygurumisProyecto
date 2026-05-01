export interface CartItem{
  productId: string;
  title: string;
  color: string;
  quantity: number;
  price: number;
  image: string;

  availableStock?: number;
  valid?: boolean;
  stockMessage?: string;
}