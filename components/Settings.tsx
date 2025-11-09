import React, { useState, useEffect } from 'react';
import { SystemSettings, Product } from '../types';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import { useToast } from '../hooks/useToast';
import EditCategoryModal from './EditCategoryModal';

interface SettingsProps {
  currentSettings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  products: Product[];
  onAddCategory: (newCategory: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
}

// Use a separate type for the form state to handle number inputs as strings
type SettingsFormState = Omit<SystemSettings, 'taxRate' | 'exchangeRate'> & {
  taxRate: string;
  exchangeRate: string;
};


const Settings: React.FC<SettingsProps> = ({ 
    currentSettings, onUpdateSettings, products,
    onAddCategory, onUpdateCategory, onDeleteCategory
}) => {
  const [formState, setFormState] = useState<SettingsFormState>({
    ...currentSettings,
    taxRate: (currentSettings.taxRate * 100).toFixed(2),
    exchangeRate: currentSettings.exchangeRate?.toString() ?? '',
  });
  const [newCategory, setNewCategory] = useState('');
  const { addToast, requestConfirmation } = useToast();
  
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);

  useEffect(() => {
    setFormState({
        ...currentSettings,
        taxRate: (currentSettings.taxRate * 100).toFixed(2),
        exchangeRate: currentSettings.exchangeRate?.toString() ?? '',
    });
  }, [currentSettings]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
        addToast({ type: 'error', message: 'Category name cannot be empty.' });
        return;
    }
    if (currentSettings.categories.map(c => c.toLowerCase()).includes(newCategory.trim().toLowerCase())) {
        addToast({ type: 'error', message: 'This category already exists.' });
        return;
    }
    onAddCategory(newCategory.trim());
    setNewCategory('');
  };

  const handleEditCategoryClick = (category: string) => {
    setCategoryToEdit(category);
    setIsEditCategoryModalOpen(true);
  };
  
  const handleConfirmUpdateCategory = (newName: string) => {
    if (!categoryToEdit) return;

    if (currentSettings.categories.map(c => c.toLowerCase()).includes(newName.toLowerCase()) && newName.toLowerCase() !== categoryToEdit.toLowerCase()) {
        addToast({ type: 'error', message: 'This category name already exists.' });
        return;
    }
    onUpdateCategory(categoryToEdit, newName);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const isCategoryInUse = products.some(p => p.category === categoryToDelete);
    if (isCategoryInUse) {
        addToast({ type: 'warning', message: `Cannot delete "${categoryToDelete}" because it is currently assigned to one or more products.`});
        return;
    }
    requestConfirmation({
        message: `Are you sure you want to delete the category "${categoryToDelete}"?`,
        onConfirm: () => {
            onDeleteCategory(categoryToDelete);
        }
    });
  };

  const handleSaveChanges = () => {
    const taxRate = parseFloat(formState.taxRate);
    const exchangeRate = parseFloat(formState.exchangeRate);
    
    onUpdateSettings({
      ...formState,
      taxRate: isNaN(taxRate) ? 0 : taxRate / 100,
      exchangeRate: isNaN(exchangeRate) ? undefined : exchangeRate,
      secondaryCurrencySymbol: formState.secondaryCurrencySymbol || undefined,
    });
  };

  return (
    <>
      <div className="space-y-8">
        {/* Financial Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Financial Settings</h3>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tax Rate (%)</label>
                        <input
                            type="number"
                            name="taxRate"
                            value={formState.taxRate}
                            onChange={handleFormChange}
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Set the sales tax rate for all transactions.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Primary Currency Symbol</label>
                        <input
                            type="text"
                            name="currencySymbol"
                            value={formState.currencySymbol || '$'}
                            onChange={handleFormChange}
                            maxLength={5}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">e.g., $, €, £, ¥</p>
                    </div>
                </div>
                <hr className="border-slate-200" />
                <div>
                    <h4 className="font-semibold text-slate-700">Exchange Rate (Optional)</h4>
                    <p className="text-sm text-slate-500 mb-4">Display a secondary currency for payment. Leave fields blank to disable.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Secondary Currency Symbol</label>
                            <input
                                type="text"
                                name="secondaryCurrencySymbol"
                                value={formState.secondaryCurrencySymbol || ''}
                                onChange={handleFormChange}
                                placeholder="e.g., ៛"
                                maxLength={5}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Exchange Rate</label>
                            <input
                                type="number"
                                name="exchangeRate"
                                value={formState.exchangeRate}
                                onChange={handleFormChange}
                                step="any"
                                min="0"
                                placeholder="e.g., 4100"
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    {formState.exchangeRate && formState.secondaryCurrencySymbol && formState.currencySymbol && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-sm font-medium text-blue-800">
                                Current Rate: 1 {formState.currencySymbol} = {formState.exchangeRate} {formState.secondaryCurrencySymbol}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Category Management */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Category Management</h3>
          <div className="flex items-end gap-2 mb-4">
              <div className="flex-grow">
                  <label className="block text-sm font-medium text-slate-700">New Category Name</label>
                  <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g., Snacks"
                      className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
              <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                  Add
              </button>
          </div>
          <ul className="space-y-2">
              {currentSettings.categories.map(category => (
                  <li key={category} className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                      <span className="font-medium text-slate-700">{category}</span>
                      <div className="flex items-center space-x-3">
                          <button onClick={() => handleEditCategoryClick(category)} className="text-blue-600 hover:text-blue-800"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCategory(category)} className="text-red-600 hover:red-800"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                  </li>
              ))}
          </ul>
        </div>

        {/* Receipt Customization */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Receipt Customization</h3>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700">Store Logo URL</label>
                  <input
                      type="text"
                      name="storeLogoUrl"
                      value={formState.storeLogoUrl}
                      onChange={handleFormChange}
                      placeholder="https://example.com/logo.png"
                      className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Store Address</label>
                  <input
                      type="text"
                      name="storeAddress"
                      value={formState.storeAddress}
                      onChange={handleFormChange}
                      placeholder="123 Main Street, Anytown, USA"
                      className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700">Receipt "Thank You" Message</label>
                  <textarea
                      name="receiptMessage"
                      value={formState.receiptMessage}
                      onChange={handleFormChange}
                      rows={2}
                      className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
              </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
          >
            Save All Settings
          </button>
        </div>
      </div>
      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        onUpdate={handleConfirmUpdateCategory}
        categoryName={categoryToEdit || ''}
      />
    </>
  );
};

export default Settings;
