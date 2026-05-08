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
import { OrdersComponent } from './features/user/orders/orders.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { ResetPasswordComponent } from './features/user/reset-password/reset-password.component';
import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { ContactComponent } from './features/contact/contact.component';
import { PatternInfoComponent } from './features/pattern-info/pattern-info.component';
import { PatternsComponent } from './features/patterns/patterns.component';
import { CartComponent } from './features/cart/cart.component';
import { ShopComponent } from './features/shop/shop.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { GuidesComponent } from './features/guides/guides.component';
import { HomeComponent } from './features/home/home.component';
import { PrivacyPolicyComponent } from './features/legal/privacy-policy/privacy-policy.component';
import { CookiesPolicyComponent } from './features/legal/cookies-policy/cookies-policy.component';
import { LegalNoticeComponent } from './features/legal/legal-notice/legal-notice.component';
import { PurchaseConditionsComponent } from './features/legal/purchase-conditions/purchase-conditions.component';

export const routes: Routes = [{
  path: '', component: HomeComponent
},
{
  path: 'guias',
  children: [
    { path: '', component: GuidesComponent},
    { path: 'materiales', component: GuidesComponent},
    { path: 'puntadas', component: GuidesComponent },
    { path: 'primeros-pasos', component: GuidesComponent }
  ],
},
{
  path: 'galeria', component: GalleryComponent
},
{
  path: 'tienda', 
  children: [
    { path: '', component: ShopComponent },
    { path: 'producto/:id', component: ProductComponent },
  ]
},
{
  path: 'carrito', component: CartComponent
},
{
  path: 'patrones',
  children: [
    { path: '', component: PatternsComponent },
    { path: ':id', component: PatternInfoComponent },
  ]
},
{
  path: 'contacto', component: ContactComponent
},
{
  path: 'login', component: LoginComponent
},
{
  path: 'registro', component: RegisterComponent
},
{
  path: 'reset-password', component: ResetPasswordComponent
},
{
  path: 'perfil', component: ProfileComponent 
},
{
  path: 'mis-pedidos',component: OrdersComponent
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
},
{
    path: 'privacidad', component: PrivacyPolicyComponent
  },
  {
    path: 'cookies', component: CookiesPolicyComponent
  },
  {
    path: 'aviso-legal', component: LegalNoticeComponent
  },
  {
    path: 'condiciones-compra', component: PurchaseConditionsComponent
  }
];
