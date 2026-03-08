export interface Product {
  id?: string;
  title: string;
  alt: string;
  description: string;
  imageUrl: string;
  price: number;
  colors: string[];
  stock:number[];
}