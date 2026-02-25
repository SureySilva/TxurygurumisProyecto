import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'guides',
    loadComponent: () =>
      import('./features/guides/guides.component')
        .then(m => m.GuidesComponent)
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./features/gallery/gallery.component')
        .then(m => m.GalleryComponent)
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component')
        .then(m => m.ShopComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component')
        .then(m => m.ContactComponent)
  }
];
