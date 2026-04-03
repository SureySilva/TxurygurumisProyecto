import { Routes } from '@angular/router';
import { ProductComponent } from './features/product/product.component';

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
  path: 'carrito',
  loadComponent: () =>
    import('./features/cart/cart.component')
      .then(m => m.CartComponent)
},
{
  path: 'patrones',
  loadComponent: () =>
    import('./features/patterns/patterns.component')
      .then(m => m.PatternsComponent)
},
{ path: 'product/:id', component: ProductComponent },
{
  path: 'pattern-info/:id',
  loadComponent: () => import('./features/pattern-info/pattern-info.component')
    .then(m => m.PatternInfoComponent)
},
{
  path: 'contacto',
  loadComponent: () =>
    import('./features/contact/contact.component')
      .then(m => m.ContactComponent)
},
{
  path: 'login',
  loadComponent: () =>
    import('./features/login/login.component')
      .then(m => m.LoginComponent)
},
{
  path: 'register',
  loadComponent: () =>
    import('./features/register/register.component')
      .then(m => m.RegisterComponent)
}
//   {
//   path: 'admin',
//   loadComponent: () => import('./admin.component'),
//   canActivate: [authGuard]
// }
];
