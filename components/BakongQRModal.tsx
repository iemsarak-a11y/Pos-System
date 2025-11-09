import React from 'react';
import { formatCurrency, formatSecondaryCurrency } from '../types';

interface BakongQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  total: number;
  currencySymbol: string;
  secondaryCurrencySymbol?: string;
  exchangeRate?: number;
}

const BakongQRModal: React.FC<BakongQRModalProps> = ({ isOpen, onClose, onConfirm, total, currencySymbol, secondaryCurrencySymbol, exchangeRate }) => {
  if (!isOpen) return null;

  const qrData = `bakong-payment-total-${total.toFixed(2)}-${Date.now()}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 animate-fade-in-up">
        <div className="p-6 text-center border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800">Pay with Bakong</h3>
            <p className="text-slate-500 mt-1">Scan the QR code with your banking app.</p>
        </div>
        <div className="p-6 flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-inner">
                <img src={qrImageUrl} alt="Bakong QR Code" className="w-52 h-52 md:w-60 md:h-60 rounded-md" />
            </div>
            <div className="text-center mt-6">
                <p className="text-slate-600 text-lg">Total Amount</p>
                <p className="text-5xl font-extrabold text-blue-600 tracking-tight">{formatCurrency(total, currencySymbol)}</p>
                 {exchangeRate && exchangeRate > 0 && secondaryCurrencySymbol && (
                  <p className="text-xl font-semibold text-slate-500 mt-1">
                    ≈ {formatSecondaryCurrency(total * exchangeRate, secondaryCurrencySymbol)}
                  </p>
                )}
                <p className="text-sm text-slate-500 animate-pulse mt-3">Waiting for payment confirmation...</p>
            </div>
        </div>
        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-3 rounded-b-xl">
             <button onClick={onClose} className="w-full sm:w-1/2 px-4 py-3 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
            </button>
            <button onClick={onConfirm} className="w-full sm:w-1/2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
                Confirm Payment
            </button>
        </div>
      </div>
    </div>
  );
};

export default BakongQRModal;
