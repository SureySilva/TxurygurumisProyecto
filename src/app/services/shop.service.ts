import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private functions = inject(Functions);

  async checkout(product: { name: string; price: number }) {
    

    const callable = httpsCallable(this.functions, 'createCheckoutSession');
    const result: any = await callable({
      name: product.name,
      price: product.price
    });




  
  }
}