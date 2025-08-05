import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PizzaOrder } from '../../models/pizza.model';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    <div class="cart-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>🛒 Carrinho</h1>
        <div class="spacer"></div>
      </div>

      <!-- Cart Items -->
      <div class="cart-content" *ngIf="cartItems.length > 0; else emptyCart">
        <div class="cart-items">
          <mat-card *ngFor="let item of cartItems" class="cart-item">
            <div class="item-header">
              <div class="item-info">
                <h3>{{ item.flavor1.name }}</h3>
                <p *ngIf="item.flavor2">+ {{ item.flavor2.name }}</p>
                <div class="item-details">
                  <span class="size">{{ getSizeLabel(item.size) }}</span>
                  <span class="quantity">x{{ item.quantity }}</span>
                </div>
              </div>
              <button
                mat-icon-button
                (click)="removeItem(item.id)"
                class="remove-button"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <div
              class="item-ingredients"
              *ngIf="item.flavor1.ingredients.length > 0"
            >
              <mat-chip
                *ngFor="let ingredient of item.flavor1.ingredients.slice(0, 3)"
                class="ingredient-chip"
              >
                {{ ingredient }}
              </mat-chip>
              <mat-chip
                *ngFor="let ingredient of item.flavor2?.ingredients.slice(0, 2)"
                class="ingredient-chip second-flavor"
              >
                {{ ingredient }}
              </mat-chip>
            </div>

            <div class="item-observations" *ngIf="item.specialInstructions">
              <p>
                <strong>Observações:</strong> {{ item.specialInstructions }}
              </p>
            </div>

            <div class="item-price">
              <span class="price">R$ {{ item.totalPrice.toFixed(2) }}</span>
            </div>
          </mat-card>
        </div>

        <!-- Order Summary -->
        <mat-card class="order-summary">
          <h3>Resumo do Pedido</h3>

          <div class="summary-item">
            <span>Subtotal</span>
            <span>R$ {{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="summary-item">
            <span>Taxa de entrega</span>
            <span>R$ {{ deliveryFee.toFixed(2) }}</span>
          </div>

          <mat-divider></mat-divider>

          <div class="summary-item total">
            <span>Total</span>
            <span>R$ {{ totalAmount.toFixed(2) }}</span>
          </div>

          <div class="delivery-info" *ngIf="deliveryFee > 0">
            <p>
              Adicione mais R$ {{ (50 - subtotal).toFixed(2) }} para frete
              grátis!
            </p>
          </div>
        </mat-card>

        <!-- Checkout Button -->
        <div class="checkout-section">
          <button
            mat-raised-button
            color="primary"
            (click)="proceedToCheckout()"
            class="checkout-button"
          >
            Finalizar Pedido - R$ {{ totalAmount.toFixed(2) }}
          </button>
        </div>
      </div>

      <!-- Empty Cart -->
      <ng-template #emptyCart>
        <div class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione algumas pizzas deliciosas para começar!</p>
          <button mat-raised-button color="primary" (click)="goToMenu()">
            Ver Menu
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .cart-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 16px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        min-height: 100vh;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(10px);
      }

      .back-button {
        color: white;
        margin-right: 12px;
      }

      .header h1 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .spacer {
        flex: 1;
      }

      .cart-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .cart-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .cart-item {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px;
      }

      .item-info h3 {
        margin: 0 0 4px 0;
        color: #333;
        font-size: 1.1rem;
      }

      .item-info p {
        margin: 0 0 8px 0;
        color: #ff6b6b;
        font-weight: 500;
      }

      .item-details {
        display: flex;
        gap: 12px;
        font-size: 0.9rem;
        color: #666;
      }

      .size {
        background: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .remove-button {
        color: #ff6b6b;
      }

      .item-ingredients {
        padding: 0 16px 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .ingredient-chip {
        font-size: 0.8rem;
        background: #f0f0f0;
        color: #666;
      }

      .ingredient-chip.second-flavor {
        background: #fff3cd;
        color: #856404;
      }

      .item-observations {
        padding: 0 16px 12px;
      }

      .item-observations p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
      }

      .item-price {
        padding: 0 16px 16px;
        text-align: right;
      }

      .price {
        font-size: 1.2rem;
        font-weight: bold;
        color: #ff6b6b;
      }

      .order-summary {
        border-radius: 12px;
        padding: 20px;
        background: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .order-summary h3 {
        margin: 0 0 16px 0;
        color: #333;
        font-size: 1.2rem;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 1rem;
      }

      .summary-item.total {
        font-weight: bold;
        font-size: 1.2rem;
        color: #ff6b6b;
        margin-top: 8px;
      }

      .delivery-info {
        margin-top: 12px;
        padding: 8px 12px;
        background: #fff3cd;
        border-radius: 6px;
        text-align: center;
      }

      .delivery-info p {
        margin: 0;
        font-size: 0.9rem;
        color: #856404;
      }

      .checkout-section {
        margin-top: 16px;
      }

      .checkout-button {
        width: 100%;
        padding: 16px;
        font-size: 1.1rem;
        border-radius: 12px;
      }

      .empty-cart {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
      }

      .empty-cart h2 {
        color: #333;
        margin-bottom: 12px;
      }

      .empty-cart p {
        color: #666;
        margin-bottom: 24px;
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .cart-container {
          padding: 8px;
        }

        .header {
          padding: 12px;
          margin-bottom: 16px;
        }

        .header h1 {
          font-size: 1.3rem;
        }

        .item-header {
          padding: 12px;
        }

        .item-info h3 {
          font-size: 1rem;
        }

        .order-summary {
          padding: 16px;
        }

        .checkout-button {
          padding: 14px;
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class CartComponent implements OnInit {
  cartItems: PizzaOrder[] = [];
  subtotal = 0;
  deliveryFee = 0;
  totalAmount = 0;

  constructor(private pizzaService: PizzaService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.pizzaService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    this.deliveryFee = this.pizzaService.calculateDeliveryFee(this.subtotal);
    this.totalAmount = this.subtotal + this.deliveryFee;
  }

  removeItem(itemId: string): void {
    this.pizzaService.removeFromCart(itemId);
  }

  getSizeLabel(size: string): string {
    const labels = {
      pequena: 'P',
      media: 'M',
      grande: 'G',
    };
    return labels[size as keyof typeof labels] || size;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToMenu(): void {
    this.router.navigate(['/']);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
