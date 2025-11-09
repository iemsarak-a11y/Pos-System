import React from 'react';
import { Product, formatCurrency } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currencySymbol: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, currencySymbol }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => !isOutOfStock && onAddToCart(product)}
      className={`bg-white rounded-lg shadow-md flex flex-col group relative ${
        isOutOfStock
          ? 'cursor-not-allowed'
          : 'hover:shadow-xl transition-shadow duration-300 cursor-pointer'
      }`}
    >
      {isOutOfStock && (
        <div className="absolute inset-0 bg-slate-100 bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
          <span className="bg-slate-800 text-white font-bold py-1 px-3 rounded-full text-sm">OUT OF STOCK</span>
        </div>
      )}
      <div className={`relative overflow-hidden ${isOutOfStock ? 'opacity-50' : ''}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <div className={`p-4 flex flex-col flex-grow ${isOutOfStock ? 'opacity-50' : ''}`}>
        <h3 className="text-lg font-bold text-slate-800 truncate">{product.name}</h3>
        <p className="text-sm text-slate-500 flex-grow mt-1">{product.description || `A delicious ${product.name.toLowerCase()}.`}</p>
        <p className="text-xl font-black text-blue-600 mt-3 self-end">{formatCurrency(product.price, currencySymbol)}</p>
      </div>
    </div>
  );
};

export default ProductCard;