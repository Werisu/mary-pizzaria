import { Route } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MenuComponent } from './components/menu/menu.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

export const appRoutes: Route[] = [
  { path: '', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: '**', redirectTo: '' },
];
