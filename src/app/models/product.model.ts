import { Timestamp } from "@angular/fire/firestore";
export interface Product {
  id?: string;
  title: string;
  alt: string;
  description: string;
  imageUrl: string;
  storagePath: string;
  price: number;
  variants?: Variant[];
  isForSale: boolean;
  showInGallery: boolean;
  createdAt?: Timestamp;
}
export interface Variant {
  color: string;
  stock: number;
}