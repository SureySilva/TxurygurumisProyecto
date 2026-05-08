import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  providers: [],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  items$: Observable<Product[]>;
  activeButton: string = 'nuevo';
  private searchSubject = new Subject<string>();
  private sortSubject = new BehaviorSubject<string>('new');
  filteredItems$!: Observable<Product[]>;
  hasItems = false;
  cartCount = 0;

  constructor(private router: Router, private userService: UserService,
    private cartService: CartService, private productService: ProductService) {
    this.items$ = this.productService.getStoreProducts();

  }


  /**
   * Inicializa el componente, configurando la actualización del contador del carrito 
   * y aplicando los filtros de búsqueda y ordenación a los productos.
   * Se suscribe a los cambios en el carrito para mantener actualizado el contador de productos 
   * y el estado de si hay productos o no.
   * Configura un flujo de datos que combina la lista de productos con los términos de búsqueda
   * y criterios de ordenación para generar una lista filtrada y ordenada de productos que se muestra en la interfaz.
   * 
   * @returns void
   */
  ngOnInit(): void {
    this.updateCartCount();


    const search$ = this.searchSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );

    const sort$ = this.sortSubject.asObservable();

    this.filteredItems$ = combineLatest([this.items$, search$, sort$]).pipe(
      map(([items, searchTerm, sortType]) => {

        // BUSCAR
        let result = items.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const getTime = (item: Product) => item.createdAt?.toMillis?.() ?? 0;
        // ORDENAR
        switch (sortType) {

          case 'price-asc':
            result = [...result].sort((a, b) => a.price - b.price);
            break;

          case 'price-desc':
            result = [...result].sort((a, b) => b.price - a.price);
            break;

          case 'new':
            result = [...result].sort((a, b) => getTime(b) - getTime(a));
            break;

        }

        return result;

      })
    );

  }

  /**
   * Actualiza el contador de productos en el carrito y el estado de si hay productos o no.
   * Se suscribe a los cambios en el carrito para recalcular el total cada vez que se modifica.
   * 
   * @returns void 
   */
  updateCartCount() {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      this.hasItems = this.cartCount > 0;
    });
  }
  /**
   * Actualiza el término de búsqueda para filtrar los productos.
   * 
   * @param value Término de búsqueda ingresado por el usuario.
   * @returns void
   */
  onSearch(value: string): void {
    this.searchSubject.next(value);
  }
  /**
   * Actualiza el criterio de ordenación para los productos.
   * @param value  Criterio de ordenación seleccionado por el usuario.
   */
  onSort(value: string): void {
    this.sortSubject.next(value);
  }
  /**
   * Navega al detalle del producto enviando el objeto
   */
  openProduct(item: Product): void {

    this.router.navigate(['tienda/producto', item.id], {
      state: { product: item }
    });

  }
  gotoCart(): void {
    this.router.navigate(['/carrito']);
  }
}