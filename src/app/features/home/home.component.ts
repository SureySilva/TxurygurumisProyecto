import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pattern } from '../../models/pattern.model';
import { PatternsService } from '../../services/patterns.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  items$: Observable<Pattern[]>;
 
   constructor(private patternsService: PatternsService) {
     this.items$ = this.patternsService.getLatest(2);
   }
}

