import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Variant } from '../../models/product.model';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {

  product: Product | null = null;
  selectedVariant!: Variant | null;
  selectedVariantIndex = 0;
  quantity: number = 1;
  showMessage = false;
  errorMessage = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.loadProduct();
  }

  private loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getProduct(id).subscribe(product => {

      this.product = product;
      this.selectedVariantIndex = 0;
      this.quantity = 1;
      if (this.product.variants?.length) {
        this.selectedVariant = this.product.variants[this.selectedVariantIndex];
      }


    });
  }
  
  onVariantChange(index: number): void {

    if (!this.product || !this.product.variants?.length) {
      this.quantity = 1;
      return;
    }

    this.selectedVariantIndex = index;
    this.selectedVariant = this.product.variants[index];

    const stock = this.product.variants[index]?.stock ?? 0;


    this.quantity = 1;

  }

  checkQuantity(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (!this.selectedVariant) {
      this.quantity = 1;
      return;
    }

    if (value > this.selectedVariant.stock) {
      value = this.selectedVariant.stock;
    } else if (value < 1) {
      value = 1;
    }

    this.quantity = value;
    input.value = String(this.quantity);
  }

  addToCart(): void {
    if (!this.product || !this.selectedVariant) return;
    var items = this.cartService.getCartItems();

    var itemExists = items.some(item => item.productId === this.product?.id && item.color === this.selectedVariant?.color);
    for (let item of items) {
      if (item.productId === this.product.id && item.color === this.selectedVariant.color) {
        // Si el producto con la misma variante ya está en el carrito y la cantidad total no excede el stock, actualizamos la cantidad
        if (item.quantity + this.quantity <= this.selectedVariant.stock) {
          this.cartService.updateItem(items.indexOf(item), {
            ...item,
            quantity: item.quantity + this.quantity
          });
          break;
        }
        else {
          //Si supera el stock, mostramos mensaje de error
          this.errorMessage = true;
          setTimeout(() => {
            this.errorMessage = false;
          }, 2000);
        }
      }

    }
    if (!itemExists) {
      this.cartService.addItem({
        productId: this.product.id,
        image: this.product.imageUrl,
        title: this.product.title,
        price: this.product.price,
        quantity: this.quantity,
        ...(this.selectedVariant.color ? { color: this.selectedVariant.color } : {})
      });
    }
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 2000);
    // Redirigimos a la tienda
    // this.router.navigate(['/tienda']);
  }


}