import { Component, OnInit } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { HomeContent } from '../../../models/home-content.model';
import { HomeService } from '../../../services/admin/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-home',
  imports: [QuillModule, CommonModule, FormsModule, QuillModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit {

  public homeContent: HomeContent = {
    welcomeTitle: '',
    welcomeText: ''
  };
  public isSaving: boolean = false;
  public message: string = '';

  public quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['clean']
      ],
    }
  };

  constructor(private homeService: HomeService, private router: Router) { }

  public ngOnInit(): void {
    this.loadHomeContent();
  }

  /**
   * Carga el contenido guardado en Firestore.
   *
   * @returns void
   */
  public loadHomeContent(): void {
    this.homeService.getHomeContent().subscribe({
      next: (content: HomeContent) => {
        if (content) {
          this.homeContent = content;
        }
      },
      error: (error: unknown) => {
        console.error('Error al cargar el contenido de inicio:', error);
        this.message = 'No se pudo cargar el contenido.';
      }
    });
  }

  /**
   * Guarda el nuevo contenido de inicio.
   *
   * @returns Promise<void>
   */
  public async saveHomeContent(): Promise<void> {
    this.isSaving = true;
    this.message = '';
    this.homeContent.welcomeText = this.cleanDescription(this.homeContent.welcomeText);
    try {
      await this.homeService.saveHomeContent(this.homeContent);
      this.message = 'Contenido guardado correctamente.';
    } catch (error: unknown) {
      console.error('Error al guardar el contenido:', error);
      this.message = 'No se pudo guardar el contenido.';
    } finally {
      this.isSaving = false;
    }
  }
  /**
* Cancela la edición y vuelve al listado.
*/
  public cancel(): void {
    this.router.navigate(['/admin/']);
  }

  /**
 * Limpia el HTML generado por Quill antes de guardarlo.
 *
 * @param html HTML del editor.
 * @returns HTML limpio.
 */
  private cleanDescription(html: string): string {
    return html
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ');
  }
}
