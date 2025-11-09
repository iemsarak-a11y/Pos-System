import React from 'react';
import { OrderItem, formatCurrency, formatSecondaryCurrency } from '../types';
import TrashIcon from './icons/TrashIcon';
import QRIcon from './icons/QRIcon';
import TagIcon from './icons/TagIcon';
import { useToast } from '../hooks/useToast';

interface OrderPanelProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearOrder: () => void;
  onProcessPayment: () => void;
  onApplyDiscount: (productId: number, discount: number) => void;
  subtotal: number;
  discountTotal: number;
  tax: number;
  total: number;
  taxRate: number;
  currencySymbol: string;
  secondaryCurrencySymbol?: string;
  exchangeRate?: number;
}

const OrderPanel: React.FC<OrderPanelProps> = ({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onProcessPayment,
  onApplyDiscount,
  subtotal,
  discountTotal,
  tax,
  total,
  taxRate,
  currencySymbol,
  secondaryCurrencySymbol,
  exchangeRate,
}) => {
  const { addToast } = useToast();
  
  const handleQuantityChange = (id: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
        onUpdateQuantity(id, newQuantity);
    } else {
        onRemoveItem(id);
    }
  };
  
  const handleDiscountClick = (item: OrderItem) => {
    const discountString = prompt(`Enter discount percentage for ${item.name}:`, `${item.discount || ''}`);
    if (discountString !== null) {
      const discount = parseFloat(discountString);
      if (!isNaN(discount) && discount >= 0 && discount <= 100) {
        onApplyDiscount(item.id, discount);
      } else if (discountString === '') {
        onApplyDiscount(item.id, 0); // Remove discount
      } else {
        addToast({ type: 'error', message: 'Please enter a valid discount percentage (0-100).' });
      }
    }
  };

  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-white flex flex-col shadow-lg">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Current Order</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {orderItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Click a product to start an order.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {orderItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              const itemDiscount = (item.discount || 0) / 100;
              const discountedTotal = itemTotal * (1 - itemDiscount);

              return (
              <li key={item.id} className="py-4 flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{item.name}</p>
                   {item.discount && item.discount > 0 && (
                     <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                       {item.discount}% OFF
                     </span>
                   )}
                  <div className="flex items-center mt-2">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="w-7 h-7 bg-slate-200 rounded-full text-slate-700 hover:bg-slate-300">-</button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="w-7 h-7 bg-slate-200 rounded-full text-slate-700 hover:bg-slate-300">+</button>
                  </div>
                </div>
                <div className="text-right">
                  {item.discount && item.discount > 0 ? (
                    <>
                      <p className="font-bold text-slate-900">{formatCurrency(discountedTotal, currencySymbol)}</p>
                      <p className="text-sm text-red-500 line-through">{formatCurrency(itemTotal, currencySymbol)}</p>
                    </>
                  ) : (
                    <p className="font-bold text-slate-900">{formatCurrency(itemTotal, currencySymbol)}</p>
                  )}
                  <div className="flex items-center justify-end mt-2 space-x-2">
                    <button onClick={() => handleDiscountClick(item)} className="text-blue-500 hover:text-blue-700">
                      <TagIcon />
                    </button>
                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        )}
      </div>
      <div className="p-5 bg-slate-50 border-t border-slate-200">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currencySymbol)}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountTotal, currencySymbol)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Tax ({(taxRate * 100).toFixed(2)}%)</span>
            <span>{formatCurrency(tax, currencySymbol)}</span>
          </div>
          <div className="border-t border-slate-300 my-2"></div>
          <div className="flex justify-between text-2xl font-bold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(total, currencySymbol)}</span>
          </div>
          {exchangeRate && exchangeRate > 0 && secondaryCurrencySymbol && (
            <div className="text-right text-base font-medium text-slate-500">
              <span>≈ {formatSecondaryCurrency(total * exchangeRate, secondaryCurrencySymbol)}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onClearOrder}
            disabled={orderItems.length === 0}
            className="w-1/2 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
          >
            Clear Sale
          </button>
          <button
            onClick={onProcessPayment}
            disabled={orderItems.length === 0}
            className="w-1/2 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <QRIcon className="w-5 h-5"/>
            <span>Charge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
