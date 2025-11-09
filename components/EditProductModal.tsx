import React, { useState, useEffect, useRef } from 'react';
import { Category, Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import { useToast } from '../hooks/useToast';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  product: Product | null;
  categories: Category[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onUpdateProduct, product, categories }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Beverages');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setCategory(product.category as Category);
      setImageUrl(product.imageUrl);
      setDescription(product.description || '');
      setDiscount(product.discount ? String(product.discount) : '');
      setStock(String(product.stock));
    }
  }, [product]);

  // Clean up blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Only revoke the URL if it's a blob URL we created.
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (!isOpen || !product) return null;

  const handleGenerateDescription = async () => {
    if (!name) {
      addToast({ type: 'warning', message: 'Please enter a product name first.' });
      return;
    }
    setIsGenerating(true);
    try {
      const generatedDesc = await generateProductDescription(name);
      setDescription(generatedDesc);
      addToast({ type: 'success', message: 'Description generated successfully!' });
    } catch {
      addToast({ type: 'error', message: 'Failed to generate description.' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Revoke previous blob url if one exists
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !imageUrl || !stock) {
        addToast({ type: 'error', message: 'Please fill all required fields.' });
        return;
    }
    onUpdateProduct({
        id: product.id,
        name,
        price: parseFloat(price),
        category,
        imageUrl,
        description,
        discount: discount ? parseFloat(discount) : undefined,
        stock: parseInt(stock, 10),
    });
    onClose();
  };

  const productCategories = categories.filter(c => c !== 'All');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-slate-800">Edit Product</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700">Product Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Price</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} step="0.01" min="0" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">Default Discount (%)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} step="1" min="0" max="100" placeholder="e.g., 10" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">Stock Quantity</label>
                    <input type="number" value={stock} onChange={e => setStock(e.target.value)} step="1" min="0" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/>
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Product Image</label>
              <div className="mt-1 flex items-center gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden border border-slate-300">
                      {imageUrl ? (
                          <img src={imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                      )}
                  </div>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                  />
                  <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                      {imageUrl ? 'Change Image' : 'Upload Image'}
                  </button>
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                <div className="relative">
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none pr-12"></textarea>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute top-2 right-2 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 disabled:bg-slate-200 disabled:text-slate-400">
                        {isGenerating ? 
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div> 
                            : <SparklesIcon />
                        }
                    </button>
                </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;