import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Pizza, PizzaOrder } from '../../models/pizza.model';
import { PizzaService } from '../../services/pizza.service';
import { PizzaDetailComponent } from '../pizza-detail/pizza-detail.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatTabsModule,
    MatDialogModule,
  ],
  template: `
    <div class="menu-container">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">🍕</div>
            <div class="logo-text">
              <h1>Mary Pizzaria</h1>
              <p>Delivery Express</p>
            </div>
          </div>
          <button mat-icon-button (click)="goToCart()" class="cart-button">
            <mat-icon [matBadge]="cartItemCount" matBadgeColor="warn"
              >shopping_cart</mat-icon
            >
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <mat-tab-group class="menu-tabs">
          <mat-tab label="Pizzas Salgadas">
            <div class="pizza-grid">
              <mat-card
                *ngFor="let pizza of salgadas"
                class="pizza-card fade-in-up"
                (click)="openPizzaDetail(pizza)"
              >
                <div class="pizza-image-container">
                  <img
                    mat-card-image
                    [src]="pizza.image"
                    [alt]="pizza.name"
                    class="pizza-image"
                  />
                  <div class="pizza-overlay">
                    <button mat-icon-button class="detail-button">
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </div>
                </div>
                <mat-card-content>
                  <h3>{{ pizza.name }}</h3>
                  <p>{{ pizza.description }}</p>
                  <div class="ingredients">
                    <mat-chip
                      *ngFor="let ingredient of pizza.ingredients.slice(0, 3)"
                      class="ingredient-chip"
                    >
                      {{ ingredient }}
                    </mat-chip>
                  </div>
                  <div class="price">R$ {{ pizza.price.toFixed(2) }}</div>
                </mat-card-content>
                <mat-card-actions>
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="addToCart(pizza, $event)"
                    class="add-button"
                  >
                    Adicionar
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Pizzas Doces">
            <div class="pizza-grid">
              <mat-card
                *ngFor="let pizza of doces"
                class="pizza-card fade-in-up"
                (click)="openPizzaDetail(pizza)"
              >
                <div class="pizza-image-container">
                  <img
                    mat-card-image
                    [src]="pizza.image"
                    [alt]="pizza.name"
                    class="pizza-image"
                  />
                  <div class="pizza-overlay">
                    <button mat-icon-button class="detail-button">
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </div>
                </div>
                <mat-card-content>
                  <h3>{{ pizza.name }}</h3>
                  <p>{{ pizza.description }}</p>
                  <div class="ingredients">
                    <mat-chip
                      *ngFor="let ingredient of pizza.ingredients.slice(0, 3)"
                      class="ingredient-chip"
                    >
                      {{ ingredient }}
                    </mat-chip>
                  </div>
                  <div class="price">R$ {{ pizza.price.toFixed(2) }}</div>
                </mat-card-content>
                <mat-card-actions>
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="addToCart(pizza, $event)"
                    class="add-button"
                  >
                    Adicionar
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [
    `
      .menu-container {
        max-width: 100%;
        margin: 0 auto;
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      }

      .header {
        background: linear-gradient(
          135deg,
          var(--primary-color) 0%,
          var(--primary-dark) 100%
        );
        padding: 20px 16px;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: var(--shadow-lg);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-icon {
        font-size: 2rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-full);
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .logo-text h1 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      .logo-text p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .cart-button {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-full);
        backdrop-filter: blur(10px);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .cart-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
      }

      .tabs-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 16px;
      }

      .menu-tabs {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-light);
      }

      .pizza-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
      }

      .pizza-card {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--border-light);
        background: var(--bg-primary);
        position: relative;
      }

      .pizza-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
        border-color: var(--primary-color);
      }

      .pizza-image-container {
        position: relative;
        overflow: hidden;
        height: 200px;
      }

      .pizza-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .pizza-card:hover .pizza-image {
        transform: scale(1.05);
      }

      .pizza-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .pizza-card:hover .pizza-overlay {
        opacity: 1;
      }

      .detail-button {
        color: white;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }

      .pizza-card h3 {
        margin: 12px 0 8px;
        color: var(--text-primary);
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.3;
      }

      .pizza-card p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .ingredients {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
      }

      .ingredient-chip {
        font-size: 0.75rem;
        height: 24px;
        background: var(--bg-secondary);
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
      }

      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 12px;
      }

      mat-card-actions {
        padding: 12px 16px 16px;
        display: flex;
        gap: 8px;
      }

      .add-button {
        flex: 1;
        background: var(--primary-color);
        color: white;
        font-weight: 600;
        border-radius: var(--radius-md);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .add-button:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .header {
          padding: 16px 12px;
        }

        .logo-text h1 {
          font-size: 1.25rem;
        }

        .logo-text p {
          font-size: 0.75rem;
        }

        .tabs-container {
          padding: 16px 12px;
        }

        .pizza-grid {
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 16px;
        }

        .pizza-image {
          height: 180px;
        }

        .pizza-card h3 {
          font-size: 1.125rem;
        }

        .price {
          font-size: 1.25rem;
        }
      }

      @media (min-width: 769px) {
        .pizza-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
      }

      /* Animation delays for staggered cards */
      .pizza-card:nth-child(1) {
        animation-delay: 0.1s;
      }
      .pizza-card:nth-child(2) {
        animation-delay: 0.2s;
      }
      .pizza-card:nth-child(3) {
        animation-delay: 0.3s;
      }
      .pizza-card:nth-child(4) {
        animation-delay: 0.4s;
      }
      .pizza-card:nth-child(5) {
        animation-delay: 0.5s;
      }
      .pizza-card:nth-child(6) {
        animation-delay: 0.6s;
      }
    `,
  ],
})
export class MenuComponent implements OnInit {
  salgadas: Pizza[] = [];
  doces: Pizza[] = [];
  cartItemCount = 0;

  constructor(
    private pizzaService: PizzaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPizzas();
    this.updateCartCount();
  }

  loadPizzas(): void {
    this.pizzaService.getPizzasByCategory('salgada').subscribe((pizzas) => {
      this.salgadas = pizzas;
    });

    this.pizzaService.getPizzasByCategory('doce').subscribe((pizzas) => {
      this.doces = pizzas;
    });
  }

  updateCartCount(): void {
    this.pizzaService.getCartItems().subscribe((items) => {
      this.cartItemCount = items.length;
    });
  }

  addToCart(pizza: Pizza, event: Event): void {
    event.stopPropagation();

    const pizzaOrder: PizzaOrder = {
      id: Date.now().toString(),
      flavor1: pizza,
      size: 'media',
      quantity: 1,
      totalPrice: pizza.price,
    };

    this.pizzaService.addToCart(pizzaOrder);
  }

  openPizzaDetail(pizza: Pizza): void {
    const isMobile = window.innerWidth <= 600;
    const dialogRef = this.dialog.open(PizzaDetailComponent, {
      width: isMobile ? '100vw' : '90vw',
      maxWidth: isMobile ? '100vw' : '500px',
      height: isMobile ? '100vh' : undefined,
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: { pizza },
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
