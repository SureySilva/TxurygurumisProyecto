import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { GalleryService } from '../../services/gallery.service';
import { Observable } from 'rxjs';
import { galleryItem } from '../../models/gallery-item.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

 items$: Observable<galleryItem[]>;

  constructor(private galleryService: GalleryService) {
    this.items$ = this.galleryService.getAll();
  }

}
