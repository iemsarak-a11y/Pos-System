import React from 'react';
import { CompletedOrder, formatCurrency, formatSecondaryCurrency } from '../types';
import CheckIcon from './icons/CheckIcon';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CompletedOrder | null;
  storeLogoUrl?: string;
  storeAddress?: string;
  receiptMessage?: string;
  currencySymbol: string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, order, storeLogoUrl, storeAddress, receiptMessage, currencySymbol }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 animate-fade-in-up">
        <div className="p-6 text-center">
            {storeLogoUrl && <img src={storeLogoUrl} alt="Store Logo" className="mx-auto h-16 w-auto mb-4" />}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Payment Successful!</h3>
            {storeAddress && <p className="text-xs text-slate-500 mt-2">{storeAddress}</p>}
        </div>
        <div className="bg-slate-50 p-6 border-y border-slate-200">
            <h4 className="text-lg font-semibold text-center mb-4 text-slate-700">Order Summary</h4>
            <div className="text-sm text-slate-600 mb-4">
                <p>Transaction Date: {new Date(order.date).toLocaleString()}</p>
            </div>
            <ul className="divide-y divide-slate-200">
                {order.items.map(item => (
                    <li key={item.id} className="py-2 flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity, currencySymbol)}</span>
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
        <div className="p-6">
            <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Start New Sale
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
