import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'guias',
    loadComponent: () =>
      import('./features/guides/guides.component')
        .then(m => m.GuidesComponent)
  },
  {
    path: 'galeria',
    loadComponent: () =>
      import('./features/gallery/gallery.component')
        .then(m => m.GalleryComponent)
  },
  {
    path: 'tienda',
    loadComponent: () =>
      import('./features/shop/shop.component')
        .then(m => m.ShopComponent)
  },
  {
    path: 'patrones',
    loadComponent: () =>
      import('./features/patterns/patterns.component')
        .then(m => m.PatternsComponent)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contact/contact.component')
        .then(m => m.ContactComponent)
  }
];
