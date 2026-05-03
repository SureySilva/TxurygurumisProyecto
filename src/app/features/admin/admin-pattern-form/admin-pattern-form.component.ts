import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pattern } from '../../../models/pattern.model';
import { PatternService } from '../../../services/admin/pattern.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MediaItem } from '../../../models/media.model';
import { MediaService } from '../../../services/admin/media.service';
import { QuillModule } from 'ngx-quill';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-pattern-form',
  imports: [FormsModule, NgIf, NgFor, QuillModule],
  templateUrl: './admin-pattern-form.component.html',
  styleUrl: './admin-pattern-form.component.scss'
})
/**
 * Componente para crear y editar patrones.
 */

export class AdminPatternFormComponent implements OnInit {
  public pattern: Pattern = {
    title: '',
    subtitle: '',
    materials: [],
    abbreviations: [],
    description: '',
    imageUrl: '',
    storagePath: '',
    difficulty: 'Principiante'
  };

  private quillEditor: any;

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
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => this.selectAndUploadQuillImage()
      }
    }
  };

  public materialsText = '';
  public abbreviationsText = '';

  public selectedFile: File | null = null;
  public imageMode: 'upload' | 'existing' = 'upload';
  public selectedMediaId = '';
  public mediaItems: MediaItem[] = [];

  public isEditMode = false;
  public isSaving = false;
  public message = '';

  private patternId: string | null = null;

  constructor(
    private patternService: PatternService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
  ) { }

  /**
   * Inicializa el formulario.
   *
   * @returns void
   */
  public ngOnInit(): void {
    this.loadMediaItems();

    this.patternId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.patternId;

    if (this.patternId) {
      this.loadPattern(this.patternId);
    }
  }

  /**
   * Carga las imágenes reutilizables.
   *
   * @returns void
   */
  public loadMediaItems(): void {
    this.mediaService.getAll().subscribe({
      next: (items: MediaItem[]) => {
        this.mediaItems = items;
      },
      error: (error: unknown) => {
        console.error('Error al cargar imágenes:', error);
      }
    });
  }

  /**
   * Carga un patrón para edición.
   *
   * @param id ID del patrón.
   * @returns void
   */
  private loadPattern(id: string): void {
    this.patternService.getPatternById(id).subscribe({
      next: (pattern: Pattern) => {
        this.pattern = pattern;
        this.materialsText = pattern.materials.join(', ');
        this.abbreviationsText = pattern.abbreviations.join(', ');
      },
      error: (error: unknown) => {
        console.error('Error al cargar el patrón:', error);
        this.message = 'No se pudo cargar el patrón.';
      }
    });
  }

  /**
   * Cambia el modo de imagen y limpia la selección anterior.
   *
   * @param mode Modo de imagen.
   * @returns void
   */
  public changeImageMode(mode: 'upload' | 'existing'): void {
    this.imageMode = mode;
    this.selectedFile = null;
    this.selectedMediaId = '';

    if (!this.isEditMode) {
      this.pattern.imageUrl = '';
      this.pattern.storagePath = '';
    }
  }

  /**
   * Guarda el archivo seleccionado y genera una vista previa.
   *
   * @param event Evento del input file.
   * @returns void
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.selectedMediaId = '';
    this.pattern.imageUrl = URL.createObjectURL(file);
    this.pattern.storagePath = '';
  }

  /**
   * Selecciona una imagen existente.
   *
   * @returns void
   */
  public selectExistingImage(): void {
    const selectedImage = this.mediaItems.find(
      (image: MediaItem) => image.id === this.selectedMediaId
    );

    if (!selectedImage) {
      return;
    }

    this.selectedFile = null;
    this.pattern.imageUrl = selectedImage.imageUrl;
    this.pattern.storagePath = selectedImage.storagePath;
  }

  /**
   * Convierte texto separado por comas a array.
   *
   * @param value Texto introducido.
   * @returns Array de textos.
   */
  private parseCommaSeparated(value: string): string[] {
    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
  }

  /**
   * Guarda el patrón.
   *
   * @returns Promise<void>
   */
  public async savePattern(): Promise<void> {
    this.isSaving = true;
    this.message = '';

    this.pattern.materials = this.parseCommaSeparated(this.materialsText);
    this.pattern.abbreviations = this.parseCommaSeparated(this.abbreviationsText);
    this.pattern.description = this.cleanDescription(this.pattern.description);

    try {
      if (this.isEditMode && this.patternId) {
        await this.patternService.updatePattern(
          this.patternId,
          this.pattern,
          this.selectedFile
        );
      } else {
        await this.patternService.createPattern(
          this.pattern,
          this.selectedFile
        );
      }

      this.router.navigate(['/admin/patrones']);
    } catch (error: unknown) {
      console.error('Error al guardar patrón:', error);
      this.message = 'No se pudo guardar el patrón.';
    } finally {
      this.isSaving = false;
    }
  }

  /**
 * Cancela la edición y vuelve al listado.
 */
  public cancel(): void {
    this.router.navigate(['/admin/patrones']); // o productos, pedidos, etc.
  }

  /**
 * Guarda la instancia del editor cuando se crea.
 *
 * @param editor Instancia de Quill.
 * @returns void
 */
  public onEditorCreated(editor: any): void {
    this.quillEditor = editor;
  }

  /**
   * Abre el selector de archivos y sube una imagen para insertarla en Quill.
   *
   * @returns void
   */
  private selectAndUploadQuillImage(): void {
    const input: HTMLInputElement = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file: File | undefined = input.files?.[0];

      if (!file) {
        return;
      }

      try {
        const imageUrl: string = await this.uploadQuillImage(file);
        this.insertImageInEditor(imageUrl);
      } catch (error: unknown) {
        console.error('Error al subir la imagen del patrón:', error);
      }
    };
  }

  /**
   * Sube una imagen de la descripción del patrón a Firebase Storage.
   *
   * @param file Archivo seleccionado.
   * @returns URL pública de la imagen subida.
   */
  private async uploadQuillImage(file: File): Promise<string> {
    const filePath: string = `imagePatterns/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, file);

    return await getDownloadURL(storageRef);
  }

  /**
   * Inserta una imagen dentro del editor Quill usando su URL.
   *
   * @param imageUrl URL pública de la imagen.
   * @returns void
   */
  private insertImageInEditor(imageUrl: string): void {
    const range = this.quillEditor.getSelection(true);
    const index: number = range ? range.index : this.quillEditor.getLength();

    this.quillEditor.insertEmbed(index, 'image', imageUrl);
    this.quillEditor.setSelection(index + 1);
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