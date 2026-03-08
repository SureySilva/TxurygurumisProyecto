import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../models/product.model';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  providers: [ShopService],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  items$: Observable<Product[]>;
  activeButton: string = 'nuevo';
  private searchSubject = new Subject<string>();
  private sortSubject = new BehaviorSubject<string>('new');
  filteredItems$!: Observable<Product[]>;
 
   constructor(private shopService: ShopService) {
     this.items$ = this.shopService.getAll();
   }

 
ngOnInit(): void {

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

      // ORDENAR
      switch (sortType) {

        case 'price-asc':
          result = [...result].sort((a, b) => a.price - b.price);
          break;

        case 'price-desc':
          result = [...result].sort((a, b) => b.price - a.price);
          break;

        case 'new':
          result = [...result].sort((a, b) => Number(b.id) - Number(a.id));
          break;

      }

      return result;

    })
  );

}

onSearch(value: string): void {
  this.searchSubject.next(value);
}
onSort(value: string): void {
  this.sortSubject.next(value);
}
}