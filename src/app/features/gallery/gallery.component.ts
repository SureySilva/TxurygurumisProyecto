import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

 items$: Observable<Product[]>;

  constructor(private productService: ProductService) {
    this.items$ = this.productService.getGalleryProducts();
  }

}
