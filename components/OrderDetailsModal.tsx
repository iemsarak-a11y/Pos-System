import React from 'react';
import { CompletedOrder, formatCurrency, formatSecondaryCurrency } from '../types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CompletedOrder | null;
  onProcessRefund: (orderId: string) => void;
  storeLogoUrl?: string;
  storeAddress?: string;
  receiptMessage?: string;
  currencySymbol: string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order, onProcessRefund, storeLogoUrl, storeAddress, receiptMessage, currencySymbol }) => {
  if (!isOpen || !order) return null;

  const isRefunded = order.status === 'refunded';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 animate-fade-in-up">
        <div className="p-6 text-center border-b border-slate-200">
            {storeLogoUrl && <img src={storeLogoUrl} alt="Store Logo" className="mx-auto h-12 w-auto mb-3" />}
            <h3 className="text-2xl font-bold text-slate-800">Order Details</h3>
            <p className="text-slate-500 mt-1">Order ID: {order.id}</p>
        </div>
        <div className="bg-slate-50 p-6 border-y border-slate-200 max-h-[60vh] overflow-y-auto">
            <div className="text-sm text-slate-600 mb-4 space-y-1">
                <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                <p><strong>Cashier:</strong> {order.cashierName}</p>
                <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        isRefunded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </p>
            </div>
            <ul className="divide-y divide-slate-200">
                {order.items.map(item => (
                    <li key={item.id} className="py-2 flex justify-between">
                        <div>
                            <p>{item.name} x{item.quantity}</p>
                            {item.discount && item.discount > 0 && (
                                <p className="text-xs text-green-600">({item.discount}% off)</p>
                            )}
                        </div>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity * (1 - (item.discount || 0) / 100), currencySymbol)}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300 space-y-2">
                 <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(order.subtotal, currencySymbol)}</span></div>
                 {order.discountTotal > 0 && (
                    <div className="flex justify-between text-green-600"><span>Discount:</span> <span>-{formatCurrency(order.discountTotal, currencySymbol)}</span></div>
                 )}
                 <div className="flex justify-between"><span>Tax:</span> <span>{formatCurrency(order.tax, currencySymbol)}</span></div>
                 <div className="flex justify-between font-bold text-lg text-slate-800"><span>Total:</span> <span>{formatCurrency(order.total, currencySymbol)}</span></div>
                  {order.exchangeRate && order.exchangeRate > 0 && order.secondaryCurrencySymbol && (
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>&nbsp;</span>
                        <span className="font-medium">≈ {formatSecondaryCurrency(order.total * order.exchangeRate, order.secondaryCurrencySymbol)}</span>
                    </div>
                 )}
            </div>
             {receiptMessage && <p className="text-xs text-slate-500 text-center mt-4">{receiptMessage}</p>}
        </div>
        <div className="p-6 bg-slate-50 flex justify-end space-x-3 rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
                Close
            </button>
            <button 
                onClick={() => onProcessRefund(order.id)}
                disabled={isRefunded}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
                {isRefunded ? 'Refunded' : 'Process Refund'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
