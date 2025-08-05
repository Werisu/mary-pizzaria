export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  category: 'salgada' | 'doce';
  available: boolean;
}

export interface PizzaOrder {
  id: string;
  flavor1: Pizza;
  flavor2?: Pizza; // Segundo sabor opcional
  size: 'pequena' | 'media' | 'grande';
  quantity: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: PizzaOrder[];
  totalAmount: number;
  deliveryFee: number;
  status: 'pendente' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
  orderDate: Date;
  estimatedDeliveryTime?: Date;
  paymentMethod: 'dinheiro' | 'cartao' | 'pix';
  changeAmount?: number;
}
