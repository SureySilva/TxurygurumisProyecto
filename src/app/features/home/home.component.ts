import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pattern } from '../../models/pattern.model';
import { PatternsService } from '../../services/patterns.service';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HomeContent } from '../../models/home-content.model';
import { HomeService } from '../../services/admin/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  patterns$: Observable<Pattern[]>;
  products$: Observable<Product[]>;
  homeContent$: Observable<HomeContent>;

 
   constructor(private patternsService: PatternsService, private userService: UserService,
               private productService: ProductService, private homeService: HomeService
   ) {
     this.patterns$ = this.patternsService.getLatest(2);
     this.products$ = this.productService.getLatest(2);
     this.homeContent$ = this.homeService.getHomeContent();

   }

}

