export interface Product {
  id?: number;
  title: string;
  alt: string;
  description: string;
  imageUrl: string;
  price: number;
  variants?: Variant[];
}
export interface Variant {
  color: string;
  stock: number;
}