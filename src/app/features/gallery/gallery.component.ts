import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

  
  items$;
constructor(private galleryService: GalleryService) {
  this.items$ = this.galleryService.getAll();

  this.items$.subscribe(data => {
    console.log('Datos gallery:', data);
  });
}
}
