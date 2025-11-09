import React, { useState } from 'react';
import { Product, CompletedOrder, User, SystemSettings, formatCurrency } from '../types';
import EditProductModal from './EditProductModal';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import Dashboard from './Dashboard';
import ChartBarIcon from './icons/ChartBarIcon';
import TableCellsIcon from './icons/TableCellsIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import SalesHistory from './SalesHistory';
import EmployeePerformance from './EmployeePerformance';
import UsersIcon from './icons/UsersIcon';
import CogIcon from './icons/CogIcon';
import Settings from './Settings';

interface AdminPanelProps {
  products: Product[];
  orderHistory: CompletedOrder[];
  users: User[];
  currentUser: User;
  systemSettings: SystemSettings;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onAddProduct: () => void;
  onViewOrderDetails: (order: CompletedOrder) => void;
  onAddUser: (newUser: Omit<User, 'id'>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: number) => void;
  onUpdateSettings: (settings: SystemSettings) => void;
  onAddCategory: (newCategory: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
  currencySymbol: string;
}

type AdminTab = 'dashboard' | 'products' | 'sales' | 'employees' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    products, orderHistory, users, currentUser, systemSettings,
    onUpdateProduct, onDeleteProduct, onAddProduct, onViewOrderDetails,
    onAddUser, onUpdateUser, onDeleteUser, onUpdateSettings,
    onAddCategory, onUpdateCategory, onDeleteCategory, currencySymbol
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
  };

  const TabButton: React.FC<{ tabName: AdminTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard orderHistory={orderHistory} products={products} currencySymbol={currencySymbol} />;
        case 'products':
            return (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Product Name</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Price</th>
                                    <th scope="col" className="px-6 py-3">Discount</th>
                                    <th scope="col" className="px-6 py-3">Stock</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center gap-4">
                                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                            {product.name}
                                        </th>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4">{formatCurrency(product.price, currencySymbol)}</td>
                                        <td className="px-6 py-4">{product.discount ? `${product.discount}%` : 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            {product.stock <= 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Out of Stock
                                                </span>
                                            ) : product.stock < 10 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {product.stock} (Low)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {product.stock}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center space-x-4">
                                                <button onClick={() => handleEditClick(product)} className="font-medium text-blue-600 hover:text-blue-800">
                                                    <PencilIcon />
                                                </button>
                                                <button onClick={() => onDeleteProduct(product.id)} className="font-medium text-red-600 hover:text-red-800">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'sales':
            return <SalesHistory orderHistory={orderHistory} onViewOrderDetails={onViewOrderDetails} currencySymbol={currencySymbol} />;
        case 'employees':
             return <EmployeePerformance 
                        orderHistory={orderHistory} 
                        users={users}
                        onAddUser={onAddUser}
                        onUpdateUser={onUpdateUser}
                        onDeleteUser={onDeleteUser}
                        currencySymbol={currencySymbol} 
                    />;
        case 'settings':
            return <Settings 
                        currentSettings={systemSettings} 
                        onUpdateSettings={onUpdateSettings}
                        products={products}
                        onAddCategory={onAddCategory}
                        onUpdateCategory={onUpdateCategory}
                        onDeleteCategory={onDeleteCategory}
                    />;
        default:
            return null;
    }
  }

  return (
    <div className="flex-1 bg-slate-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 flex-wrap">
                <TabButton tabName="dashboard" label="Dashboard" icon={<ChartBarIcon className="w-5 h-5" />} />
                <TabButton tabName="products" label="Products" icon={<TableCellsIcon className="w-5 h-5" />} />
                <TabButton tabName="sales" label="Sales History" icon={<ClipboardListIcon className="w-5 h-5" />} />
                {currentUser.role === 'manager' && (
                  <TabButton tabName="employees" label="Employees" icon={<UsersIcon className="w-5 h-5" />} />
                )}
                 {currentUser.role === 'manager' && (
                  <TabButton tabName="settings" label="Settings" icon={<CogIcon className="w-5 h-5" />} />
                )}
            </div>
            {activeTab === 'products' && (
                <button
                    onClick={onAddProduct}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Product</span>
                </button>
            )}
        </div>

        {renderContent()}
      </div>
      <EditProductModal
        isOpen={!!editingProduct}
        onClose={handleCloseModal}
        onUpdateProduct={onUpdateProduct}
        product={editingProduct}
        categories={systemSettings.categories}
      />
    </div>
  );
};

export default AdminPanel;