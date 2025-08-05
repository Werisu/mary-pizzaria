import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Pizza, PizzaOrder } from '../../models/pizza.model';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'app-pizza-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  template: `
    <div class="pizza-detail">
      <div class="header">
        <div class="header-content">
          <div class="pizza-info">
            <h2>{{ data.pizza.name }}</h2>
            <p class="pizza-category">
              {{
                data.pizza.category === 'salgada'
                  ? 'Pizza Salgada'
                  : 'Pizza Doce'
              }}
            </p>
          </div>
          <button mat-icon-button (click)="close()" class="close-button">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <mat-dialog-content class="dialog-content">
        <div class="pizza-image">
          <img [src]="data.pizza.image" [alt]="data.pizza.name" />
          <div class="image-overlay">
            <div class="price-badge">
              <span class="price-label">A partir de</span>
              <span class="price-value"
                >R$ {{ data.pizza.price.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>

        <div class="pizza-info-content">
          <p class="description">{{ data.pizza.description }}</p>

          <div class="ingredients-section">
            <h4>Ingredientes</h4>
            <div class="ingredients-grid">
              <mat-chip
                *ngFor="let ingredient of data.pizza.ingredients"
                class="ingredient-chip"
              >
                {{ ingredient }}
              </mat-chip>
            </div>
          </div>

          <div class="customization-section">
            <h4>Personalizar Pedido</h4>

            <!-- Tamanho -->
            <div class="size-section">
              <h5>Tamanho</h5>
              <mat-radio-group
                [(ngModel)]="selectedSize"
                (change)="updatePrice()"
                class="size-options"
              >
                <mat-radio-button value="pequena" class="size-option">
                  <div class="size-content">
                    <span class="size-name">Pequena</span>
                    <span class="size-price"
                      >R$ {{ (data.pizza.price * 0.8).toFixed(2) }}</span
                    >
                  </div>
                </mat-radio-button>
                <mat-radio-button value="media" class="size-option">
                  <div class="size-content">
                    <span class="size-name">Média</span>
                    <span class="size-price"
                      >R$ {{ data.pizza.price.toFixed(2) }}</span
                    >
                  </div>
                </mat-radio-button>
                <mat-radio-button value="grande" class="size-option">
                  <div class="size-content">
                    <span class="size-name">Grande</span>
                    <span class="size-price"
                      >R$ {{ (data.pizza.price * 1.3).toFixed(2) }}</span
                    >
                  </div>
                </mat-radio-button>
              </mat-radio-group>
            </div>

            <!-- Quantidade -->
            <div class="quantity-section">
              <h5>Quantidade</h5>
              <div class="quantity-controls">
                <button
                  mat-icon-button
                  (click)="decreaseQuantity()"
                  [disabled]="quantity <= 1"
                  class="quantity-btn"
                >
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="quantity">{{ quantity }}</span>
                <button
                  mat-icon-button
                  (click)="increaseQuantity()"
                  class="quantity-btn"
                >
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>

            <!-- Segundo Sabor -->
            <div class="second-flavor-section">
              <h5>Segundo Sabor</h5>
              <mat-checkbox
                [(ngModel)]="hasSecondFlavor"
                (change)="onSecondFlavorChange()"
                class="second-flavor-checkbox"
              >
                Quero pizza de dois sabores
              </mat-checkbox>

              <div *ngIf="hasSecondFlavor" class="second-flavor-selector">
                <mat-form-field appearance="outline">
                  <mat-label>Escolha o segundo sabor</mat-label>
                  <mat-select
                    [(ngModel)]="selectedSecondFlavor"
                    (selectionChange)="updatePrice()"
                  >
                    <mat-option
                      *ngFor="let pizza of availablePizzas"
                      [value]="pizza"
                    >
                      {{ pizza.name }} - R$ {{ pizza.price.toFixed(2) }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <!-- Observações -->
            <div class="observations-section">
              <h5>Observações</h5>
              <mat-form-field appearance="outline" class="full-width">
                <textarea
                  matInput
                  [(ngModel)]="specialInstructions"
                  placeholder="Ex: Sem cebola, borda recheada, etc."
                  rows="3"
                ></textarea>
              </mat-form-field>
            </div>
          </div>

          <div class="price-breakdown">
            <h4>Resumo do Pedido</h4>
            <div class="price-items">
              <div class="price-item">
                <span>{{ data.pizza.name }} ({{ selectedSize }})</span>
                <span
                  >R$ {{ (data.pizza.price * sizeMultiplier).toFixed(2) }}</span
                >
              </div>
              <div
                *ngIf="hasSecondFlavor && selectedSecondFlavor"
                class="price-item"
              >
                <span
                  >{{ selectedSecondFlavor.name }} ({{ selectedSize }})</span
                >
                <span
                  >R$
                  {{
                    (selectedSecondFlavor.price * sizeMultiplier).toFixed(2)
                  }}</span
                >
              </div>
              <div class="price-item total">
                <span>Total ({{ quantity }}x)</span>
                <span>R$ {{ totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="addToCart()"
          class="add-button"
        >
          <mat-icon>shopping_cart</mat-icon>
          Adicionar ao Carrinho - R$ {{ totalPrice.toFixed(2) }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .pizza-detail {
        max-width: 100%;
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        background: linear-gradient(
          135deg,
          var(--primary-color) 0%,
          var(--primary-dark) 100%
        );
        padding: 20px;
        color: white;
        flex-shrink: 0;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .pizza-info h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      .pizza-category {
        margin: 4px 0 0;
        font-size: 0.875rem;
        opacity: 0.9;
        font-weight: 500;
      }

      .close-button {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-full);
        backdrop-filter: blur(10px);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .close-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
      }

      .dialog-content {
        flex: 1;
        overflow-y: auto;
        padding: 0;
      }

      .pizza-image {
        position: relative;
        width: 100%;
        height: 250px;
        overflow: hidden;
      }

      .pizza-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .image-overlay {
        position: absolute;
        top: 16px;
        right: 16px;
      }

      .price-badge {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border-radius: var(--radius-full);
        padding: 8px 16px;
        color: white;
        text-align: center;
      }

      .price-label {
        display: block;
        font-size: 0.75rem;
        opacity: 0.8;
      }

      .price-value {
        display: block;
        font-size: 1.125rem;
        font-weight: 700;
      }

      .pizza-info-content {
        padding: 24px;
      }

      .description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 24px;
        font-size: 1rem;
      }

      .ingredients-section,
      .customization-section,
      .price-breakdown {
        margin-bottom: 24px;
      }

      .ingredients-section h4,
      .customization-section h4,
      .price-breakdown h4 {
        margin-bottom: 16px;
        color: var(--text-primary);
        font-size: 1.125rem;
        font-weight: 600;
      }

      .ingredients-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .ingredient-chip {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
        font-size: 0.875rem;
        height: 28px;
      }

      .size-section,
      .quantity-section,
      .second-flavor-section,
      .observations-section {
        margin-bottom: 20px;
      }

      .size-section h5,
      .quantity-section h5,
      .second-flavor-section h5,
      .observations-section h5 {
        margin-bottom: 12px;
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 600;
      }

      .size-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .size-option {
        border-radius: var(--radius-md);
        padding: 12px 16px;
        margin: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .size-option:hover {
        background: var(--bg-tertiary);
        border-color: var(--primary-color);
      }

      .size-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .size-name {
        font-weight: 500;
        color: var(--text-primary);
      }

      .size-price {
        font-weight: 600;
        color: var(--primary-color);
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 16px;
        justify-content: center;
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        padding: 12px;
        border: 1px solid var(--border-color);
      }

      .quantity-btn {
        color: var(--text-secondary);
        background: var(--bg-primary);
        border-radius: var(--radius-sm);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .quantity-btn:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
      }

      .quantity {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        min-width: 40px;
        text-align: center;
      }

      .second-flavor-checkbox {
        margin-bottom: 12px;
      }

      .second-flavor-selector {
        margin-top: 12px;
      }

      .full-width {
        width: 100%;
      }

      .price-breakdown {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: 20px;
        border: 1px solid var(--border-color);
      }

      .price-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
      }

      .price-item.total {
        font-weight: 700;
        font-size: 1.125rem;
        color: var(--primary-color);
        border-top: 1px solid var(--border-color);
        padding-top: 12px;
        margin-top: 8px;
      }

      .dialog-actions {
        padding: 20px 24px;
        background: var(--bg-secondary);
        margin: 0;
        flex-shrink: 0;
        border-top: 1px solid var(--border-color);
      }

      .add-button {
        width: 100%;
        padding: 16px;
        font-size: 1.125rem;
        font-weight: 600;
        background: var(--primary-color);
        color: white;
        border-radius: var(--radius-md);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .add-button:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .pizza-info-content {
          padding: 20px;
        }

        .pizza-image {
          height: 200px;
        }

        .header-content h2 {
          font-size: 1.25rem;
        }

        .add-button {
          font-size: 1rem;
          padding: 14px;
        }

        .size-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .quantity-controls {
          padding: 8px;
        }
      }
    `,
  ],
})
export class PizzaDetailComponent {
  selectedSize: 'pequena' | 'media' | 'grande' = 'media';
  quantity = 1;
  hasSecondFlavor = false;
  selectedSecondFlavor: Pizza | null = null;
  specialInstructions = '';
  totalPrice = 0;
  availablePizzas: Pizza[] = [];

  private dialogRef = inject(MatDialogRef<PizzaDetailComponent>);
  public data = inject(MAT_DIALOG_DATA) as { pizza: Pizza };
  private pizzaService = inject(PizzaService);

  constructor() {
    this.loadAvailablePizzas();
    this.updatePrice();
  }

  get sizeMultiplier(): number {
    const multipliers = {
      pequena: 0.8,
      media: 1.0,
      grande: 1.3,
    };
    return multipliers[this.selectedSize];
  }

  loadAvailablePizzas(): void {
    this.pizzaService.getPizzas().subscribe((pizzas) => {
      this.availablePizzas = pizzas.filter((p) => p.id !== this.data.pizza.id);
    });
  }

  updatePrice(): void {
    let basePrice = this.data.pizza.price * this.sizeMultiplier;

    if (this.hasSecondFlavor && this.selectedSecondFlavor) {
      basePrice += this.selectedSecondFlavor.price * this.sizeMultiplier;
    }

    this.totalPrice = basePrice * this.quantity;
  }

  increaseQuantity(): void {
    this.quantity++;
    this.updatePrice();
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.updatePrice();
    }
  }

  onSecondFlavorChange(): void {
    if (!this.hasSecondFlavor) {
      this.selectedSecondFlavor = null;
    }
    this.updatePrice();
  }

  addToCart(): void {
    const pizzaOrder: PizzaOrder = {
      id: Date.now().toString(),
      flavor1: this.data.pizza,
      flavor2: this.hasSecondFlavor ? this.selectedSecondFlavor! : undefined,
      size: this.selectedSize,
      quantity: this.quantity,
      totalPrice: this.totalPrice,
      specialInstructions: this.specialInstructions,
    };

    this.pizzaService.addToCart(pizzaOrder);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
