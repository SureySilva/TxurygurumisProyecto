import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Pattern } from '../../../models/pattern.model';
import { PatternService } from '../../../services/admin/pattern.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-admin-patterns',
  imports: [NgFor,NgIf, AsyncPipe ],
  templateUrl: './admin-patterns.component.html',
  styleUrl: './admin-patterns.component.scss'
})

export class AdminPatternsComponent {
  /**
   * Lista de patrones.
   */
  public patterns$: Observable<Pattern[]>;

  /**
   * Crea una instancia del componente.
   *
   * @param patternService Servicio de patrones.
   * @param router Servicio de rutas.
   */
  constructor(
    private patternService: PatternService,
    private router: Router
  ) {
    this.patterns$ = this.patternService.getPatterns();
  }

  /**
   * Navega al formulario de creación.
   *
   * @returns void
   */
  public addPattern(): void {
    this.router.navigate(['/admin/patrones/nuevo']);
  }

  /**
   * Navega al formulario de edición.
   *
   * @param pattern Patrón a editar.
   * @returns void
   */
  public editPattern(pattern: Pattern): void {
    this.router.navigate(['/admin/patrones/editar', pattern.id]);
  }

  /**
   * Elimina un patrón.
   *
   * @param pattern Patrón a eliminar.
   * @returns Promise<void>
   */
  public async deletePattern(pattern: Pattern): Promise<void> {
    if (!pattern.id) {
      return;
    }
    const confirmed: boolean = confirm(`¿Eliminar el patrón "${pattern.title}"?`);
    if (!confirmed) {
      return;
    }
    await this.patternService.deletePattern(pattern.id);
  }
}