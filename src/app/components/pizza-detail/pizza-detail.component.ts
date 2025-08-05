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
        <h2>{{ data.pizza.name }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="pizza-image">
        <img [src]="data.pizza.image" [alt]="data.pizza.name" />
      </div>

      <div class="pizza-info">
        <p class="description">{{ data.pizza.description }}</p>

        <div class="ingredients">
          <h4>Ingredientes:</h4>
          <div class="ingredients-grid">
            <mat-chip
              *ngFor="let ingredient of data.pizza.ingredients"
              class="ingredient-chip"
            >
              {{ ingredient }}
            </mat-chip>
          </div>
        </div>

        <div class="customization">
          <h4>Personalizar Pedido</h4>

          <!-- Tamanho -->
          <div class="size-section">
            <h5>Tamanho:</h5>
            <mat-radio-group
              [(ngModel)]="selectedSize"
              (change)="updatePrice()"
            >
              <mat-radio-button value="pequena"
                >Pequena (R$
                {{ (data.pizza.price * 0.8).toFixed(2) }})</mat-radio-button
              >
              <mat-radio-button value="media"
                >Média (R$ {{ data.pizza.price.toFixed(2) }})</mat-radio-button
              >
              <mat-radio-button value="grande"
                >Grande (R$
                {{ (data.pizza.price * 1.3).toFixed(2) }})</mat-radio-button
              >
            </mat-radio-group>
          </div>

          <!-- Quantidade -->
          <div class="quantity-section">
            <h5>Quantidade:</h5>
            <div class="quantity-controls">
              <button
                mat-icon-button
                (click)="decreaseQuantity()"
                [disabled]="quantity <= 1"
              >
                <mat-icon>remove</mat-icon>
              </button>
              <span class="quantity">{{ quantity }}</span>
              <button mat-icon-button (click)="increaseQuantity()">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>

          <!-- Segundo Sabor -->
          <div class="second-flavor-section">
            <h5>Adicionar segundo sabor?</h5>
            <mat-checkbox
              [(ngModel)]="hasSecondFlavor"
              (change)="onSecondFlavorChange()"
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
            <h5>Observações:</h5>
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

        <div class="price-section">
          <div class="price-breakdown">
            <div class="price-item">
              <span>{{ data.pizza.name }}</span>
              <span
                >R$ {{ (data.pizza.price * sizeMultiplier).toFixed(2) }}</span
              >
            </div>
            <div
              *ngIf="hasSecondFlavor && selectedSecondFlavor"
              class="price-item"
            >
              <span>{{ selectedSecondFlavor.name }}</span>
              <span
                >R$
                {{
                  (selectedSecondFlavor.price * sizeMultiplier).toFixed(2)
                }}</span
              >
            </div>
            <div class="price-item total">
              <span>Total</span>
              <span>R$ {{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button
          mat-raised-button
          color="primary"
          (click)="addToCart()"
          class="add-button"
        >
          Adicionar ao Carrinho - R$ {{ totalPrice.toFixed(2) }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .pizza-detail {
        max-width: 100%;
        background: white;
        border-radius: 12px;
        overflow: hidden;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
      }

      .header h2 {
        margin: 0;
        font-size: 1.3rem;
      }

      .pizza-image {
        width: 100%;
        height: 250px;
        overflow: hidden;
      }

      .pizza-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .pizza-info {
        padding: 20px;
      }

      .description {
        color: #666;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .ingredients h4 {
        margin-bottom: 12px;
        color: #333;
      }

      .ingredients-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
      }

      .ingredient-chip {
        background: #f0f0f0;
        color: #666;
        font-size: 0.9rem;
      }

      .customization h4 {
        margin-bottom: 16px;
        color: #333;
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
        margin-bottom: 8px;
        color: #555;
        font-size: 1rem;
      }

      mat-radio-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .quantity {
        font-size: 1.2rem;
        font-weight: bold;
        min-width: 30px;
        text-align: center;
      }

      .second-flavor-selector {
        margin-top: 12px;
      }

      .full-width {
        width: 100%;
      }

      .price-section {
        margin-top: 24px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .price-breakdown {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .price-item.total {
        font-weight: bold;
        font-size: 1.1rem;
        color: #ff6b6b;
        border-top: 1px solid #ddd;
        padding-top: 8px;
        margin-top: 8px;
      }

      .actions {
        padding: 16px 20px;
        background: #f8f9fa;
      }

      .add-button {
        width: 100%;
        padding: 12px;
        font-size: 1.1rem;
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .pizza-info {
          padding: 16px;
        }

        .pizza-image {
          height: 200px;
        }

        .header h2 {
          font-size: 1.2rem;
        }

        .add-button {
          font-size: 1rem;
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
