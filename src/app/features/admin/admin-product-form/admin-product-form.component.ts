import { Component } from '@angular/core';
import { Product, Variant } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaItem } from '../../../models/media.model';
import { MediaService } from '../../../services/admin/media.service';


/**
 * Componente para crear productos.
 */
@Component({
  selector: 'app-admin-product-form',
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.scss']
})
export class AdminProductFormComponent {


  /**
   * Producto en edición.
   */
  public product: Product = {
    title: '',
    alt: '',
    description: '',
    imageUrl: '',
    storagePath: '',
    price: 0,
    variants: [{ color: "Único", stock: 0 }],
    isForSale: false,
    showInGallery: true,
  };

  public selectedFile: File | null = null;
  public productId: string | null = null;
  public isEditMode: boolean = false;
  public isSaving: boolean = false;
  public errorMessage: string = '';

  //Imagen
  public imageMode: 'upload' | 'existing' = 'upload';
  public mediaItems: MediaItem[] = [];
  public selectedMediaId: string = '';
  /**
   * Crea una instancia del componente.
   *
   * @param productService Servicio de productos.
   */
  constructor(private productService: ProductService, private route: ActivatedRoute,
    private router: Router, private mediaService: MediaService) { }

  /**
   * Inicializa el formulario.
   *
   * @returns void
   */
  public ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    this.loadMediaItems();
    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  /**
   * Carga un producto para edición.
   *
   * @param id Identificador del producto.
   * @returns void
   */
  public loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
      },
      error: (error: unknown) => {
        console.error('Error al cargar producto:', error);
      }
    });
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
   * Asigna al producto una imagen existente.
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

    this.product.imageUrl = selectedImage.imageUrl;
    this.product.storagePath = selectedImage.storagePath;
    this.selectedFile = null;
  }
  /**
   * Guarda el archivo seleccionado.
   *
   * @param event Evento del input file.
   * @returns void
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) {
      this.selectedFile = null;
      this.product.imageUrl = '';
      return;
    }

    this.selectedFile = file;
    this.selectedMediaId = '';
    this.product.storagePath = '';

    this.product.imageUrl = URL.createObjectURL(file);
  }

  /**
 * Cambia el modo de selección de imagen y limpia la selección anterior.
 *
 * @param mode Modo de imagen seleccionado.
 * @returns void
 */
  public changeImageMode(mode: 'upload' | 'existing'): void {
    this.imageMode = mode;
    this.selectedFile = null;
    this.selectedMediaId = '';
    this.product.imageUrl = '';
    this.product.storagePath = '';
  }
  /**
   * Añade una nueva variante vacía al producto.
   *
   * @returns void
   */
  public addVariant(): void {
    if (!this.product.variants) {
      this.product.variants = [];
    }

    this.product.variants.push({
      color: '',
      stock: 0
    });
  }

  /**
  * Elimina una variante del producto por índice.
  *
  * @param index Índice de la variante a eliminar.
  * @returns void
  */
  public removeVariant(index: number): void {
    if (!this.product.variants) {
      return;
    }

    this.product.variants.splice(index, 1);
  }

  /**
   * Valida que el producto tenga los datos mínimos necesarios.
   *
   * @returns true si el formulario es válido; false en caso contrario.
   */
  public validateForm(): boolean {
    this.errorMessage = '';

    if (!this.product.title.trim()) {
      this.errorMessage = 'El título es obligatorio.';
      return false;
    }

    if (!this.product.alt.trim()) {
      this.errorMessage = 'El texto alternativo es obligatorio.';
      return false;
    }

    if (!this.product.description.trim()) {
      this.errorMessage = 'La descripción es obligatoria.';
      return false;
    }

    if (!this.selectedFile && !this.isEditMode) {
      this.errorMessage = 'Debes seleccionar una imagen.';
      return false;
    }

    if (this.product.isForSale && this.product.price <= 0) {
      this.errorMessage = 'El precio debe ser mayor que 0 si el producto está a la venta.';
      return false;
    }

    if (this.product.variants?.length) {
      const hasInvalidVariant: boolean = this.product.variants.some(
        (variant: Variant) =>
          !variant.color.trim() || variant.stock < 0
      );

      if (hasInvalidVariant) {
        this.errorMessage = 'Revisa las variantes: color obligatorio y stock no negativo.';
        return false;
      }
    }

    return true;
  }
  /**
   * Guarda el producto en Firebase.
   *
   * @returns Promise<void>
   */
  public async saveProduct(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode && this.productId) {
        await this.productService.updateProduct(
          this.productId,
          this.product,
          this.selectedFile
        );
      } else {
        await this.productService.createProduct(
          this.product,
          this.selectedFile
        );
      }

      this.router.navigate(['/admin/productos']);
    } catch (error: unknown) {
      console.error('Error al guardar el producto:', error);
      this.errorMessage = 'No se pudo guardar el producto.';
    } finally {
      this.isSaving = false;
    }
  }


  /**
   * Reinicia el formulario.
   *
   * @returns void
   */
  public resetForm(): void {
    this.product = {
      title: '',
      alt: '',
      description: '',
      imageUrl: '',
      storagePath: '',
      price: 0,
      variants: [{ color: "Único", stock: 0 }],
      isForSale: false,
      showInGallery: true,
      createdAt: Timestamp.now()
    };

    this.selectedFile = null;
  }

  /**
 * Devuelve el texto del botón principal del formulario.
 *
 * @returns Texto del botón.
 */
  public getSaveButtonText(): string {
    if (this.isSaving) {
      return 'Guardando...';
    }

    return this.isEditMode ? 'Guardar cambios' : 'Crear producto';
  }
}