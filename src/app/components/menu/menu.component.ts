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
        <h1>🍕 Mary Pizzaria</h1>
        <button mat-icon-button (click)="goToCart()" class="cart-button">
          <mat-icon [matBadge]="cartItemCount" matBadgeColor="warn"
            >shopping_cart</mat-icon
          >
        </button>
      </div>

      <!-- Tabs -->
      <mat-tab-group class="menu-tabs">
        <mat-tab label="Pizzas Salgadas">
          <div class="pizza-grid">
            <mat-card
              *ngFor="let pizza of salgadas"
              class="pizza-card"
              (click)="openPizzaDetail(pizza)"
            >
              <img
                mat-card-image
                [src]="pizza.image"
                [alt]="pizza.name"
                class="pizza-image"
              />
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
              class="pizza-card"
              (click)="openPizzaDetail(pizza)"
            >
              <img
                mat-card-image
                [src]="pizza.image"
                [alt]="pizza.name"
                class="pizza-image"
              />
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
                >
                  Adicionar
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .menu-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 16px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        min-height: 100vh;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(10px);
      }

      .header h1 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .cart-button {
        color: white;
      }

      .menu-tabs {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .pizza-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        padding: 16px;
      }

      .pizza-card {
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border-radius: 12px;
        overflow: hidden;
      }

      .pizza-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .pizza-image {
        height: 200px;
        object-fit: cover;
      }

      .pizza-card h3 {
        margin: 8px 0;
        color: #333;
        font-size: 1.2rem;
      }

      .pizza-card p {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .ingredients {
        margin-bottom: 12px;
      }

      .ingredient-chip {
        font-size: 0.8rem;
        margin: 2px;
        background: #f0f0f0;
        color: #666;
      }

      .price {
        font-size: 1.3rem;
        font-weight: bold;
        color: #ff6b6b;
        margin-bottom: 12px;
      }

      mat-card-actions {
        padding: 8px 16px 16px;
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .menu-container {
          padding: 8px;
        }

        .header {
          padding: 12px;
          margin-bottom: 16px;
        }

        .header h1 {
          font-size: 1.3rem;
        }

        .pizza-grid {
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 12px;
        }

        .pizza-image {
          height: 180px;
        }
      }

      @media (min-width: 769px) {
        .pizza-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
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
