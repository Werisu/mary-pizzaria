import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, Pizza, PizzaOrder } from '../models/pizza.model';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  private pizzas: Pizza[] = [
    {
      id: 1,
      name: 'Margherita',
      description: 'Molho de tomate, mussarela, manjericão fresco',
      price: 25.0,
      image:
        'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Margherita',
      ingredients: ['Molho de tomate', 'Mussarela', 'Manjericão'],
      category: 'salgada',
      available: true,
    },
    {
      id: 2,
      name: 'Pepperoni',
      description: 'Molho de tomate, mussarela, pepperoni',
      price: 28.0,
      image: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Pepperoni',
      ingredients: ['Molho de tomate', 'Mussarela', 'Pepperoni'],
      category: 'salgada',
      available: true,
    },
    {
      id: 3,
      name: 'Quatro Queijos',
      description:
        'Molho de tomate, mussarela, parmesão, gorgonzola, provolone',
      price: 32.0,
      image:
        'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Quatro+Queijos',
      ingredients: [
        'Molho de tomate',
        'Mussarela',
        'Parmesão',
        'Gorgonzola',
        'Provolone',
      ],
      category: 'salgada',
      available: true,
    },
    {
      id: 4,
      name: 'Calabresa',
      description: 'Molho de tomate, mussarela, calabresa, cebola',
      price: 26.0,
      image: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Calabresa',
      ingredients: ['Molho de tomate', 'Mussarela', 'Calabresa', 'Cebola'],
      category: 'salgada',
      available: true,
    },
    {
      id: 5,
      name: 'Frango com Catupiry',
      description: 'Molho de tomate, mussarela, frango desfiado, catupiry',
      price: 30.0,
      image:
        'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Frango+Catupiry',
      ingredients: [
        'Molho de tomate',
        'Mussarela',
        'Frango desfiado',
        'Catupiry',
      ],
      category: 'salgada',
      available: true,
    },
    {
      id: 6,
      name: 'Portuguesa',
      description:
        'Molho de tomate, mussarela, presunto, ovos, cebola, azeitonas',
      price: 29.0,
      image:
        'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Portuguesa',
      ingredients: [
        'Molho de tomate',
        'Mussarela',
        'Presunto',
        'Ovos',
        'Cebola',
        'Azeitonas',
      ],
      category: 'salgada',
      available: true,
    },
    {
      id: 7,
      name: 'Chocolate',
      description: 'Chocolate ao leite, morangos, chantilly',
      price: 35.0,
      image: 'https://via.placeholder.com/300x200/ffd700/ffffff?text=Chocolate',
      ingredients: ['Chocolate ao leite', 'Morangos', 'Chantilly'],
      category: 'doce',
      available: true,
    },
    {
      id: 8,
      name: 'Banana com Canela',
      description: 'Banana caramelizada, canela, açúcar mascavo',
      price: 33.0,
      image:
        'https://via.placeholder.com/300x200/ffd700/ffffff?text=Banana+Canela',
      ingredients: ['Banana caramelizada', 'Canela', 'Açúcar mascavo'],
      category: 'doce',
      available: true,
    },
  ];

  private cartItems = new BehaviorSubject<PizzaOrder[]>([]);
  private orders = new BehaviorSubject<Order[]>([]);

  constructor() {}

  getPizzas(): Observable<Pizza[]> {
    return new Observable((observer) => {
      observer.next(this.pizzas);
      observer.complete();
    });
  }

  getPizzasByCategory(category: 'salgada' | 'doce'): Observable<Pizza[]> {
    return new Observable((observer) => {
      const filteredPizzas = this.pizzas.filter(
        (pizza) => pizza.category === category
      );
      observer.next(filteredPizzas);
      observer.complete();
    });
  }

  getPizzaById(id: number): Pizza | undefined {
    return this.pizzas.find((pizza) => pizza.id === id);
  }

  addToCart(pizzaOrder: PizzaOrder): void {
    const currentItems = this.cartItems.value;
    this.cartItems.next([...currentItems, pizzaOrder]);
  }

  removeFromCart(itemId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter((item) => item.id !== itemId);
    this.cartItems.next(updatedItems);
  }

  getCartItems(): Observable<PizzaOrder[]> {
    return this.cartItems.asObservable();
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  calculateTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderDate'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: this.generateOrderId(),
      orderDate: new Date(),
    };

    const currentOrders = this.orders.value;
    this.orders.next([...currentOrders, newOrder]);
    this.clearCart();

    return newOrder;
  }

  getOrders(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  private generateOrderId(): string {
    return 'PED' + Date.now().toString().slice(-6);
  }

  calculateDeliveryFee(total: number): number {
    return total >= 50 ? 0 : 5;
  }

  getSizePrice(size: 'pequena' | 'media' | 'grande'): number {
    const sizeMultipliers = {
      pequena: 0.8,
      media: 1.0,
      grande: 1.3,
    };
    return sizeMultipliers[size];
  }
}
