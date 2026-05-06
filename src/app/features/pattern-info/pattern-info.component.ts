import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Pattern } from '../../models/pattern.model';
import { PatternsService } from '../../services/patterns.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-pattern-info',
  imports: [NgIf, NgFor, BreadcrumbComponent],
  templateUrl: './pattern-info.component.html',
  styleUrl: './pattern-info.component.scss'
})
export class PatternInfoComponent {

  pattern: Pattern | null = null;

  constructor(private patternsService: PatternsService, private route: ActivatedRoute,) {
    this.loadPattern();
  }

  /**
   *  Carga el patrón actual basado en el ID de la ruta. Si no se encuentra un ID, no hace nada.
   * @return void 
   */
  loadPattern(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.patternsService.getPattern(id).subscribe(pattern => {

      this.pattern = pattern;
    });
  }

  /**
   *  Convierte una lista de elementos en filas para mostrar en la plantilla.
   * @param items  La lista de elementos a convertir en filas.
   * @param cols  El número de columnas por fila.
   * @returns  Una matriz de filas, donde cada fila es una matriz de elementos.
   */
  getRows(items: string[], cols: number): string[][] {
    const rows: string[][] = [];
    for (let i = 0; i < items.length; i += cols) {
      rows.push(items.slice(i, i + cols));
    }
    return rows;
  }
}
