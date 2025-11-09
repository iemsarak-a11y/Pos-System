import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  currencySymbol: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, currencySymbol }) => {
  return (
    <div className="p-4 bg-slate-50 lg:flex-1 lg:overflow-y-auto">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} currencySymbol={currencySymbol} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;