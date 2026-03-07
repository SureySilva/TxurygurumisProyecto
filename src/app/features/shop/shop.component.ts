import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [ShopService],
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  products = [
    { name: 'Amigurumi Conejo', price: 25 },
    { name: 'Amigurumi Oso', price: 30 },
  ];

  constructor(private shopService: ShopService) {}

  buy(product: { name: string; price: number }) {
    this.shopService.checkout(product);
  }
}