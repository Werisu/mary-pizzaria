import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { PizzaOrder } from '../../models/pizza.model';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    <div class="checkout-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>📋 Finalizar Pedido</h1>
        <div class="spacer"></div>
      </div>

      <div class="checkout-content">
        <!-- Customer Information -->
        <mat-card class="customer-form">
          <h3>Dados para Entrega</h3>

          <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome completo</mat-label>
                <input
                  matInput
                  formControlName="customerName"
                  placeholder="Digite seu nome"
                />
                <mat-error
                  *ngIf="checkoutForm.get('customerName')?.hasError('required')"
                >
                  Nome é obrigatório
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Telefone</mat-label>
                <input
                  matInput
                  formControlName="customerPhone"
                  placeholder="(11) 99999-9999"
                />
                <mat-error
                  *ngIf="
                    checkoutForm.get('customerPhone')?.hasError('required')
                  "
                >
                  Telefone é obrigatório
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Endereço completo</mat-label>
                <textarea
                  matInput
                  formControlName="customerAddress"
                  placeholder="Rua, número, bairro, cidade - CEP"
                  rows="3"
                ></textarea>
                <mat-error
                  *ngIf="
                    checkoutForm.get('customerAddress')?.hasError('required')
                  "
                >
                  Endereço é obrigatório
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Payment Method -->
            <div class="payment-section">
              <h4>Forma de Pagamento</h4>
              <mat-radio-group
                formControlName="paymentMethod"
                class="payment-options"
              >
                <mat-radio-button value="dinheiro">Dinheiro</mat-radio-button>
                <mat-radio-button value="cartao">Cartão</mat-radio-button>
                <mat-radio-button value="pix">PIX</mat-radio-button>
              </mat-radio-group>

              <div
                *ngIf="checkoutForm.get('paymentMethod')?.value === 'dinheiro'"
                class="change-section"
              >
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Troco para</mat-label>
                  <input
                    matInput
                    formControlName="changeAmount"
                    type="number"
                    placeholder="0,00"
                  />
                  <span matSuffix>R$</span>
                </mat-form-field>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
              <h4>Resumo do Pedido</h4>

              <div class="order-items">
                <div *ngFor="let item of cartItems" class="order-item">
                  <div class="item-info">
                    <span class="item-name">{{ item.flavor1.name }}</span>
                    <span *ngIf="item.flavor2" class="second-flavor"
                      >+ {{ item.flavor2.name }}</span
                    >
                    <span class="item-details"
                      >{{ getSizeLabel(item.size) }} x{{ item.quantity }}</span
                    >
                  </div>
                  <span class="item-price"
                    >R$ {{ item.totalPrice.toFixed(2) }}</span
                  >
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="summary-totals">
                <div class="summary-item">
                  <span>Subtotal</span>
                  <span>R$ {{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="summary-item">
                  <span>Taxa de entrega</span>
                  <span>R$ {{ deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="summary-item total">
                  <span>Total</span>
                  <span>R$ {{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>

              <div
                *ngIf="
                  checkoutForm.get('paymentMethod')?.value === 'dinheiro' &&
                  changeAmount > 0
                "
                class="change-info"
              >
                <p>Troco: R$ {{ (changeAmount - totalAmount).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="submit-section">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="checkoutForm.invalid || isSubmitting"
                class="submit-button"
              >
                <mat-icon *ngIf="isSubmitting">hourglass_empty</mat-icon>
                {{ isSubmitting ? 'Processando...' : 'Confirmar Pedido' }}
              </button>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .checkout-container {
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

      .checkout-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .customer-form {
        border-radius: 12px;
        padding: 20px;
        background: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .customer-form h3 {
        margin: 0 0 20px 0;
        color: #333;
        font-size: 1.3rem;
      }

      .form-row {
        margin-bottom: 16px;
      }

      .full-width {
        width: 100%;
      }

      .payment-section {
        margin: 24px 0;
      }

      .payment-section h4 {
        margin-bottom: 12px;
        color: #333;
      }

      .payment-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .change-section {
        margin-top: 12px;
      }

      .order-summary {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }

      .order-summary h4 {
        margin-bottom: 16px;
        color: #333;
      }

      .order-items {
        margin-bottom: 16px;
      }

      .order-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        padding: 8px 0;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .item-name {
        font-weight: 500;
        color: #333;
      }

      .second-flavor {
        color: #ff6b6b;
        font-size: 0.9rem;
      }

      .item-details {
        font-size: 0.8rem;
        color: #666;
      }

      .item-price {
        font-weight: 500;
        color: #333;
      }

      .summary-totals {
        margin-top: 16px;
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

      .change-info {
        margin-top: 12px;
        padding: 8px 12px;
        background: #e8f5e8;
        border-radius: 6px;
        text-align: center;
      }

      .change-info p {
        margin: 0;
        color: #2e7d32;
        font-weight: 500;
      }

      .submit-section {
        margin-top: 24px;
      }

      .submit-button {
        width: 100%;
        padding: 16px;
        font-size: 1.1rem;
        border-radius: 12px;
      }

      .submit-button mat-icon {
        margin-right: 8px;
      }

      /* Mobile First */
      @media (max-width: 768px) {
        .checkout-container {
          padding: 8px;
        }

        .header {
          padding: 12px;
          margin-bottom: 16px;
        }

        .header h1 {
          font-size: 1.3rem;
        }

        .customer-form {
          padding: 16px;
        }

        .customer-form h3 {
          font-size: 1.2rem;
        }

        .submit-button {
          padding: 14px;
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: PizzaOrder[] = [];
  subtotal = 0;
  deliveryFee = 0;
  totalAmount = 0;
  changeAmount = 0;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private pizzaService: PizzaService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerAddress: ['', Validators.required],
      paymentMethod: ['dinheiro', Validators.required],
      changeAmount: [0],
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.setupFormListeners();
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

  setupFormListeners(): void {
    this.checkoutForm.get('changeAmount')?.valueChanges.subscribe((value) => {
      this.changeAmount = value || 0;
    });
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
    this.router.navigate(['/cart']);
  }

  submitOrder(): void {
    if (this.checkoutForm.valid) {
      this.isSubmitting = true;

      const orderData = {
        customerName: this.checkoutForm.value.customerName,
        customerPhone: this.checkoutForm.value.customerPhone,
        customerAddress: this.checkoutForm.value.customerAddress,
        items: this.cartItems,
        totalAmount: this.totalAmount,
        deliveryFee: this.deliveryFee,
        status: 'pendente' as const,
        paymentMethod: this.checkoutForm.value.paymentMethod,
        changeAmount: this.checkoutForm.value.changeAmount,
      };

      const order = this.pizzaService.createOrder(orderData);

      // Simular processamento
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/order-confirmation', order.id]);
      }, 2000);
    }
  }
}
