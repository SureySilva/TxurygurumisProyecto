import { Component } from '@angular/core';
import { Pattern } from '../../models/pattern.model';
import { PatternsService } from '../../services/patterns.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patterns',
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './patterns.component.html',
  styleUrl: './patterns.component.scss'
})
export class PatternsComponent {

  items$: Observable<Pattern[]>;

  constructor(private patternsService: PatternsService, private router: Router) {
    this.items$ = this.patternsService.getAll();
  }
  getRows(items: string[], cols: number): string[][] {
    const rows: string[][] = [];
    for (let i = 0; i < items.length; i += cols) {
      rows.push(items.slice(i, i + cols));
    }
    return rows;
  }
  viewPattern(item: Pattern) {
   this.router.navigate(['/pattern-info', item.id], {
    state: { pattern: item }
  });
  }
}
