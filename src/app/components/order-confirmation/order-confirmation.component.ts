import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/pizza.model';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    <div class="confirmation-container">
      <!-- Header -->
      <div class="header">
        <h1>✅ Pedido Confirmado!</h1>
        <p>Seu pedido foi recebido e está sendo preparado</p>
      </div>

      <!-- Order Details -->
      <mat-card class="order-details" *ngIf="order">
        <div class="order-header">
          <h2>Pedido #{{ order.id }}</h2>
          <div class="order-status">
            <span class="status-badge">{{ getStatusLabel(order.status) }}</span>
          </div>
        </div>

        <div class="order-info">
          <div class="info-section">
            <h3>Dados do Cliente</h3>
            <div class="info-item">
              <strong>Nome:</strong> {{ order.customerName }}
            </div>
            <div class="info-item">
              <strong>Telefone:</strong> {{ order.customerPhone }}
            </div>
            <div class="info-item">
              <strong>Endereço:</strong> {{ order.customerAddress }}
            </div>
          </div>

          <div class="info-section">
            <h3>Forma de Pagamento</h3>
            <div class="info-item">
              <strong>{{ getPaymentMethodLabel(order.paymentMethod) }}</strong>
              <span *ngIf="order.changeAmount && order.changeAmount > 0">
                - Troco para R$ {{ order.changeAmount.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <h3>Itens do Pedido</h3>
          <div class="item-list">
            <div *ngFor="let item of order.items" class="order-item">
              <div class="item-info">
                <div class="item-name">
                  <span>{{ item.flavor1.name }}</span>
                  <span *ngIf="item.flavor2" class="second-flavor"
                    >+ {{ item.flavor2.name }}</span
                  >
                </div>
                <div class="item-details">
                  <span class="size">{{ getSizeLabel(item.size) }}</span>
                  <span class="quantity">x{{ item.quantity }}</span>
                </div>
                <div
                  class="item-ingredients"
                  *ngIf="item.flavor1.ingredients.length > 0"
                >
                  <mat-chip
                    *ngFor="
                      let ingredient of item.flavor1.ingredients.slice(0, 3)
                    "
                    class="ingredient-chip"
                  >
                    {{ ingredient }}
                  </mat-chip>
                  <mat-chip
                    *ngFor="
                      let ingredient of item.flavor2?.ingredients.slice(0, 2)
                    "
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
              </div>
              <div class="item-price">
                <span>R$ {{ item.totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <mat-divider></mat-divider>

          <div class="summary-item">
            <span>Subtotal</span>
            <span
              >R$ {{ (order.totalAmount - order.deliveryFee).toFixed(2) }}</span
            >
          </div>

          <div class="summary-item">
            <span>Taxa de entrega</span>
            <span>R$ {{ order.deliveryFee.toFixed(2) }}</span>
          </div>

          <div class="summary-item total">
            <span>Total</span>
            <span>R$ {{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-info">
          <h3>Informações de Entrega</h3>
          <div class="delivery-time">
            <mat-icon>schedule</mat-icon>
            <span>Tempo estimado de entrega: 30-45 minutos</span>
          </div>
          <div class="delivery-note">
            <p>Entraremos em contato quando o pedido estiver a caminho!</p>
          </div>
        </div>
      </mat-card>

      <!-- Actions -->
      <div class="actions">
        <button
          mat-raised-button
          color="primary"
          (click)="newOrder()"
          class="new-order-button"
        >
          Fazer Novo Pedido
        </button>
        <button mat-stroked-button (click)="goToMenu()" class="menu-button">
          Ver Menu
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirmation-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 16px;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        min-height: 100vh;
      }

      .header {
        text-align: center;
        margin-bottom: 24px;
        padding: 24px 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(10px);
      }

      .header h1 {
        color: white;
        margin: 0 0 8px 0;
        font-size: 1.8rem;
        font-weight: bold;
      }

      .header p {
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-size: 1.1rem;
      }

      .order-details {
        border-radius: 12px;
        padding: 20px;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
      }

      .order-header h2 {
        margin: 0;
        color: #333;
        font-size: 1.4rem;
      }

      .status-badge {
        background: #4caf50;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .order-info {
        margin-bottom: 24px;
      }

      .info-section {
        margin-bottom: 20px;
      }

      .info-section h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1.1rem;
      }

      .info-item {
        margin-bottom: 8px;
        color: #666;
        line-height: 1.4;
      }

      .info-item strong {
        color: #333;
      }

      .order-items h3 {
        margin: 0 0 16px 0;
        color: #333;
        font-size: 1.1rem;
      }

      .item-list {
        margin-bottom: 20px;
      }

      .order-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .item-info {
        flex: 1;
      }

      .item-name {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .item-name span {
        font-weight: 500;
        color: #333;
      }

      .second-flavor {
        color: #ff6b6b;
        font-size: 0.9rem;
      }

      .item-details {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
        font-size: 0.9rem;
        color: #666;
      }

      .size {
        background: #e3f2fd;
        color: #1976d2;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 500;
      }

      .item-ingredients {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 8px;
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
        margin-top: 8px;
      }

      .item-observations p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
      }

      .item-price {
        font-weight: bold;
        color: #ff6b6b;
        font-size: 1.1rem;
      }

      .order-summary {
        margin-top: 20px;
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
        border-top: 1px solid #ddd;
        padding-top: 8px;
        margin-top: 8px;
      }

      .delivery-info {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }

      .delivery-info h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1.1rem;
      }

      .delivery-time {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: #666;
      }

      .delivery-time mat-icon {
        color: #4caf50;
      }

      .delivery-note {
        background: #e8f5e8;
        padding: 12px;
        border-radius: 6px;
      }

      .delivery-note p {
        margin: 0;
        color: #2e7d32;
        font-size: 0.9rem;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .new-order-button,
      .menu-button {
        width: 100%;
        padding: 16px;
        font-size: 1.1rem;
        border-radius: 12px;
      }

      .menu-button {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .confirmation-container {
          padding: 8px;
        }

        .header {
          padding: 20px 12px;
          margin-bottom: 20px;
        }

        .header h1 {
          font-size: 1.5rem;
        }

        .header p {
          font-size: 1rem;
        }

        .order-details {
          padding: 16px;
        }

        .order-header h2 {
          font-size: 1.2rem;
        }

        .order-item {
          padding: 12px;
        }

        .new-order-button,
        .menu-button {
          padding: 14px;
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pizzaService: PizzaService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(orderId: string): void {
    this.pizzaService.getOrders().subscribe((orders) => {
      this.order = orders.find((order) => order.id === orderId) || null;
      if (!this.order) {
        this.router.navigate(['/']);
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels = {
      pendente: 'Pendente',
      preparando: 'Preparando',
      saiu_entrega: 'Saiu para Entrega',
      entregue: 'Entregue',
      cancelado: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  }

  getPaymentMethodLabel(method: string): string {
    const labels = {
      dinheiro: 'Dinheiro',
      cartao: 'Cartão',
      pix: 'PIX',
    };
    return labels[method as keyof typeof labels] || method;
  }

  getSizeLabel(size: string): string {
    const labels = {
      pequena: 'P',
      media: 'M',
      grande: 'G',
    };
    return labels[size as keyof typeof labels] || size;
  }

  newOrder(): void {
    this.pizzaService.clearCart();
    this.router.navigate(['/']);
  }

  goToMenu(): void {
    this.router.navigate(['/']);
  }
}
