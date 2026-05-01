import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent {


  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  //Filtros
  private filterSubject = new BehaviorSubject<'all' | 'store' | 'gallery' | 'both'>('all');
  public filter$ = this.filterSubject.asObservable();


  constructor(private productService: ProductService, private router: Router) {
    this.products$ = this.productService.getProducts();
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.filter$
    ]).pipe(
      map(([products, filter]) => {
        if (filter === 'store') {
          return products.filter((p: Product) => p.isForSale && !p.showInGallery);
        }

        if (filter === 'gallery') {
          return products.filter((p: Product) => p.showInGallery && !p.isForSale);
        }

        if (filter === 'both') {
          return products.filter((p: Product) => p.showInGallery && p.isForSale);
        }

        return products;
      })
    );
  }


  /**
   * Cambia el filtro activo.
   *
   * @param filter Filtro seleccionado.
   */
  public setFilter(filter: 'all' | 'store' | 'gallery' | 'both'): void {
    this.filterSubject.next(filter);
  }

  /**
   * Redirige al formulario para crear un producto.
   *
   * @returns void
   */
  public addProduct(): void {
    this.router.navigate(['/admin/productos/nuevo']);
  }
  /**
   * Redirige al formulario de edición.
   *
   * @param product Producto a editar.
   * @returns void
   */
  public editProduct(product: Product): void {
    this.router.navigate(['/admin/productos/editar', product.id]);
  }
  /**
     * Elimina un producto.
     *
     * @param product Producto a eliminar.
     * @returns Promise<void>
     */
  public async deleteProduct(product: Product): Promise<void> {
    const confirmed: boolean = confirm(`¿Eliminar "${product.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await this.productService.deleteProduct(product);
    } catch (error: unknown) {
      console.error('Error al eliminar producto:', error);
    }
  }
}
