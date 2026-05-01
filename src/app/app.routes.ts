import { Routes } from '@angular/router';
import { ProductComponent } from './features/product/product.component';
import { authGuard } from './core/guards/auth.guard';
import { AdminProductFormComponent } from './features/admin/admin-product-form/admin-product-form.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './core/guards/admin.guard';
import { AdminPatternsComponent } from './features/admin/admin-patterns/admin-patterns.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { AdminHomeComponent } from './features/admin/admin-home/admin-home.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AdminPatternFormComponent } from './features/admin/admin-pattern-form/admin-pattern-form.component';

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
    import('./features/user/login/login.component')
      .then(m => m.LoginComponent)
},
{
  path: 'register',
  loadComponent: () =>
    import('./features/user/register/register.component')
      .then(m => m.RegisterComponent)
},
{
  path: 'reset-password',
  loadComponent: () =>
    import('./features/user/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent)
},
{
  path: 'perfil',
  loadComponent: () =>
    import('./features/user/profile/profile.component')
      .then(m => m.ProfileComponent)
},
{
  path: 'mis-pedidos',
  loadComponent: () =>
    import('./features/user/orders/orders.component')
      .then(m => m.OrdersComponent)
},
  {
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  children: [
    { path: '', component: AdminDashboardComponent },
    { path: 'inicio', component: AdminHomeComponent },
    { path: 'productos', component: AdminProductsComponent },
    { path: 'productos/editar/:id', component: AdminProductFormComponent },
    { path: 'productos/nuevo', component: AdminProductFormComponent },
    { path: 'patrones', component: AdminPatternsComponent },
    { path: 'patrones/nuevo', component: AdminPatternFormComponent },
    { path: 'patrones/editar/:id', component: AdminPatternFormComponent },
    { path: 'pedidos', component: AdminOrdersComponent }
  ]
}
];
