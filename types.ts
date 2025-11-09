export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
  discount?: number; // Default discount percentage for the product
  stock: number;
}

export interface OrderItem extends Product {
  quantity: number;
  discount?: number; // Discount percentage for this specific order item
}

export type Category = string;

export interface User {
  id: number;
  name:string;
  pin: string; // 4-digit PIN
  role: 'manager' | 'cashier' | 'supervisor';
}

export interface CompletedOrder {
  id: string; // Unique identifier for the order
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  tax: number;
  total: number;
  date: string;
  status: 'completed' | 'refunded'; // Order status
  cashierName: string; // Name of the employee who processed the order
  exchangeRate?: number;
  secondaryCurrencySymbol?: string;
}

export interface SystemSettings {
  taxRate: number; // e.g., 0.08 for 8%
  categories: Category[];
  storeLogoUrl: string;
  storeAddress: string;
  receiptMessage: string;
  currencySymbol: string;
  secondaryCurrencySymbol?: string;
  exchangeRate?: number; // 1 primary = X secondary
}

export const formatCurrency = (amount: number, currencySymbol: string = '$'): string => {
  return `${currencySymbol}${amount.toFixed(2)}`;
};

export const formatSecondaryCurrency = (amount: number, currencySymbol: string): string => {
  // Formats with commas and no decimals, suitable for currencies like KHR or JPY
  const formattedAmount = Math.round(amount).toLocaleString('en-US');
  return `${currencySymbol} ${formattedAmount}`;
};
