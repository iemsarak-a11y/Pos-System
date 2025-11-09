import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, Category, OrderItem, CompletedOrder, User, SystemSettings } from './types';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import OrderPanel from './components/OrderPanel';
import ReceiptModal from './components/ReceiptModal';
import AddProductModal from './components/AddProductModal';
import BakongQRModal from './components/BakongQRModal';
import AdminPanel from './components/AdminPanel';
import AdminIcon from './components/icons/AdminIcon';
import OrderDetailsModal from './components/OrderDetailsModal';
import LoginScreen from './components/LoginScreen';
import LogoutIcon from './components/icons/LogoutIcon';
import { useToast } from './hooks/useToast';

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso', price: 2.50, category: 'Beverages', imageUrl: 'https://picsum.photos/seed/espresso/400', description: 'A rich and aromatic shot of concentrated coffee.', stock: 100 },
  { id: 2, name: 'Latte', price: 3.50, category: 'Beverages', imageUrl: 'https://picsum.photos/seed/latte/400', description: 'Smooth espresso with steamed milk, topped with a light layer of foam.', stock: 8 },
  { id: 3, name: 'Croissant', price: 2.75, category: 'Pastries', imageUrl: 'https://picsum.photos/seed/croissant/400', description: 'Buttery, flaky, and freshly baked to perfection.', stock: 50 },
  { id: 4, name: 'Turkey Sandwich', price: 7.50, category: 'Sandwiches', imageUrl: 'https://picsum.photos/seed/sandwich/400', description: 'Roasted turkey, fresh lettuce, and tomato on whole wheat bread.', stock: 30 },
  { id: 5, name: 'Muffin', price: 3.00, category: 'Pastries', imageUrl: 'https://picsum.photos/seed/muffin/400', description: 'A soft and moist muffin, available in blueberry or chocolate chip.', stock: 0 },
  { id: 6, name: 'Iced Coffee', price: 3.25, category: 'Beverages', imageUrl: 'https://picsum.photos/seed/icedcoffee/400', description: 'Chilled coffee served over ice, perfect for a warm day.', stock: 80 },
  { id: 7, name: 'POS Tumbler', price: 15.00, category: 'Merchandise', imageUrl: 'https://picsum.photos/seed/tumbler/400', description: 'A stylish and reusable tumbler for your favorite drinks.', discount: 10, stock: 25 }
];

const INITIAL_USERS: User[] = [
    { id: 1, name: 'Admin', pin: '1111', role: 'manager' },
    { id: 2, name: 'Jessica', pin: '2222', role: 'cashier' },
    { id: 3, name: 'Michael', pin: '3333', role: 'cashier' },
    { id: 4, name: 'Susan', pin: '4444', role: 'supervisor' },
];

const INITIAL_SETTINGS: SystemSettings = {
  taxRate: 0.08,
  categories: ['Beverages', 'Pastries', 'Sandwiches', 'Merchandise'],
  storeLogoUrl: 'https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg',
  storeAddress: '123 Gemini Way, Mountain View, CA 94043',
  receiptMessage: 'Thank you for your business!',
  currencySymbol: '$',
  secondaryCurrencySymbol: '៛',
  exchangeRate: 4100,
};

const PRODUCTS_STORAGE_KEY = 'gemini-pos-pro-products';
const ORDERS_STORAGE_KEY = 'gemini-pos-pro-orders';
const USERS_STORAGE_KEY = 'gemini-pos-pro-users';
const SETTINGS_STORAGE_KEY = 'gemini-pos-pro-settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { addToast, requestConfirmation } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;
    } catch (error) {
      console.error("Could not load products from localStorage", error);
      return INITIAL_PRODUCTS;
    }
  });

  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      return storedOrders ? JSON.parse(storedOrders) : [];
    } catch (error) {
        console.error("Could not load order history from localStorage", error);
        return [];
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
    } catch (error) {
      console.error("Could not load users from localStorage", error);
      return INITIAL_USERS;
    }
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        // Merge stored settings with initial settings to ensure all keys are present
        const parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};
        return { ...INITIAL_SETTINGS, ...parsedSettings };
    } catch (error) {
        console.error("Could not load settings from localStorage", error);
        return INITIAL_SETTINGS;
    }
  });
  
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isBakongModalOpen, setBakongModalOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<CompletedOrder | null>(null);
  const [view, setView] = useState<'pos' | 'admin'>('pos');
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Could not save products to localStorage", error);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orderHistory));
    } catch (error) {
      console.error("Could not save order history to localStorage", error);
    }
  }, [orderHistory]);
  
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Could not save users to localStorage", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(systemSettings));
    } catch (error) {
        console.error("Could not save settings to localStorage", error);
    }
  }, [systemSettings]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('pos'); // Default to POS view on login
    addToast({ type: 'success', message: `Welcome, ${user.name}!` });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const { subtotal, discountTotal, tax, total } = useMemo(() => {
    const subtotal = currentOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountTotal = currentOrder.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;
        const discountAmount = itemTotal * ((item.discount || 0) / 100);
        return acc + discountAmount;
    }, 0);
    
    const discountedSubtotal = subtotal - discountTotal;
    const tax = discountedSubtotal * systemSettings.taxRate;
    const total = discountedSubtotal + tax;
    
    return { subtotal, discountTotal, tax, total };
  }, [currentOrder, systemSettings.taxRate]);

  const handleAddToCart = useCallback((product: Product) => {
    const productInStock = products.find(p => p.id === product.id);
    if (!productInStock || productInStock.stock <= 0) {
      addToast({ type: 'warning', message: `${product.name} is out of stock.` });
      return;
    }

    setCurrentOrder(prevOrder => {
      const existingItem = prevOrder.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity + 1 > productInStock.stock) {
            addToast({ type: 'warning', message: `Not enough stock for ${product.name}. Only ${productInStock.stock} available.` });
            return prevOrder;
        }
        return prevOrder.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevOrder, { ...product, quantity: 1, discount: product.discount || 0 }];
    });
  }, [products, addToast]);

  const handleUpdateQuantity = useCallback((productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.stock) {
      addToast({ type: 'warning', message: `Not enough stock for ${product.name}. Only ${product.stock} available.` });
      return;
    }

    setCurrentOrder(prevOrder =>
      prevOrder.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [products, addToast]);

  const handleApplyDiscount = useCallback((productId: number, discount: number) => {
    setCurrentOrder(prevOrder =>
      prevOrder.map(item =>
        item.id === productId ? { ...item, discount: discount } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((productId: number) => {
    setCurrentOrder(prevOrder => prevOrder.filter(item => item.id !== productId));
  }, []);

  const handleClearOrder = useCallback(() => {
    setCurrentOrder([]);
  }, []);

  const handleInitiatePayment = useCallback(() => {
    if (currentOrder.length > 0) {
      setBakongModalOpen(true);
    }
  }, [currentOrder.length]);

  const handleConfirmPayment = useCallback(() => {
    if (!currentUser) {
      addToast({ type: 'error', message: 'Error: No user logged in. Please log out and log back in.' });
      return;
    }
    const completedOrder: CompletedOrder = {
      id: `ORD-${Date.now()}`,
      items: currentOrder,
      subtotal,
      discountTotal,
      tax,
      total,
      date: new Date().toISOString(),
      status: 'completed',
      cashierName: currentUser.name,
      exchangeRate: systemSettings.exchangeRate,
      secondaryCurrencySymbol: systemSettings.secondaryCurrencySymbol,
    };
    
    // Deduct stock
    setProducts(prevProducts => {
        const updatedProducts = [...prevProducts];
        currentOrder.forEach(orderItem => {
            const productIndex = updatedProducts.findIndex(p => p.id === orderItem.id);
            if (productIndex !== -1) {
                const newStock = updatedProducts[productIndex].stock - orderItem.quantity;
                updatedProducts[productIndex].stock = newStock < 0 ? 0 : newStock;
            }
        });
        return updatedProducts;
    });

    setOrderHistory(prev => [completedOrder, ...prev]);
    setLastCompletedOrder(completedOrder);
    setBakongModalOpen(false);
    setReceiptModalOpen(true);
  }, [currentOrder, subtotal, discountTotal, tax, total, currentUser, addToast, systemSettings.exchangeRate, systemSettings.secondaryCurrencySymbol]);

  const handleNewSale = useCallback(() => {
    setCurrentOrder([]);
    setLastCompletedOrder(null);
    setReceiptModalOpen(false);
  }, []);

  const handleAddProduct = useCallback((newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
        ...newProductData,
        id: Date.now(), // simple unique id
    };
    setProducts(prev => [...prev, newProduct]);
    setAddProductModalOpen(false);
    addToast({ type: 'success', message: `Product "${newProduct.name}" added.` });
  }, [addToast]);

  const handleUpdateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addToast({ type: 'success', message: `Product "${updatedProduct.name}" updated.` });
  }, [addToast]);
  
  const handleDeleteProduct = useCallback((productId: number) => {
    requestConfirmation({
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: () => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        addToast({ type: 'info', message: 'Product has been deleted.' });
      }
    });
  }, [requestConfirmation, addToast]);

  const handleAddUser = useCallback((newUserData: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...newUserData, id: Date.now() }]);
    addToast({ type: 'success', message: `Employee "${newUserData.name}" added.` });
  }, [addToast]);
  
  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addToast({ type: 'success', message: `Employee "${updatedUser.name}" updated.` });
  }, [addToast]);
  
  const handleDeleteUser = useCallback((userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === 'manager') {
      const managerCount = users.filter(u => u.role === 'manager').length;
      if (managerCount <= 1) {
        addToast({ type: 'error', message: 'Cannot delete the last manager. Please assign a new manager first.' });
        return;
      }
    }
    requestConfirmation({
      message: `Are you sure you want to delete employee "${userToDelete?.name}"?`,
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        addToast({ type: 'info', message: 'Employee has been deleted.' });
      }
    });
  }, [users, requestConfirmation, addToast]);

  const handleViewOrderDetails = useCallback((order: CompletedOrder) => {
    setSelectedOrder(order);
  }, []);
  
  const handleProcessRefund = useCallback((orderId: string) => {
    const orderToRefund = orderHistory.find(o => o.id === orderId);
    if (!orderToRefund || orderToRefund.status === 'refunded') {
      addToast({ type: 'error', message: "Order not found or already refunded." });
      return;
    }
    
    requestConfirmation({
      message: `Are you sure you want to refund order ${orderId}? This action will return stock to inventory.`,
      onConfirm: () => {
        // Restore stock
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          orderToRefund.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
              updatedProducts[productIndex].stock += item.quantity;
            }
          });
          return updatedProducts;
        });
      
        // Update order status
        setOrderHistory(prevHistory => 
          prevHistory.map(order => 
            order.id === orderId ? { ...order, status: 'refunded' } : order
          )
        );
      
        // Close the details modal
        setSelectedOrder(null); 
        addToast({ type: 'success', message: `Order ${orderId} has been successfully refunded.` });
      }
    });
  }, [orderHistory, requestConfirmation, addToast]);

  const handleUpdateSettings = useCallback((newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    addToast({ type: 'success', message: 'Settings have been saved successfully!' });
  }, [addToast]);

  const handleAddCategory = useCallback((newCategory: string) => {
    setSystemSettings(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
    }));
    addToast({ type: 'success', message: `Category "${newCategory}" added.` });
  }, [addToast]);

  const handleUpdateCategory = useCallback((oldName: string, newName: string) => {
    // Update products that use this category
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));
    
    // Update the category list in settings
    setSystemSettings(prev => ({
        ...prev,
        categories: prev.categories.map(c => c === oldName ? newName : c)
    }));
    addToast({ type: 'success', message: `Category "${oldName}" renamed to "${newName}".` });
  }, [addToast]);

  const handleDeleteCategory = useCallback((categoryToDelete: string) => {
    setSystemSettings(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== categoryToDelete)
    }));
    addToast({ type: 'info', message: `Category "${categoryToDelete}" deleted.` });
  }, [addToast]);


  if (!currentUser) {
    return <LoginScreen users={users} onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-blue-600">Gemini POS Pro</h1>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-sm text-slate-500 capitalize">{currentUser.role}</p>
            </div>
            {['manager', 'supervisor'].includes(currentUser.role) && (
                <button 
                    onClick={() => setView(v => v === 'pos' ? 'admin' : 'pos')}
                    className="flex items-center space-x-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                    <AdminIcon className="w-5 h-5" />
                    <span>{view === 'pos' ? 'Admin Panel' : 'Back to POS'}</span>
                </button>
            )}
             <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                title="Logout"
            >
                <LogoutIcon className="w-5 h-5" />
            </button>
        </div>
      </header>
      
      {view === 'pos' ? (
        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
            <main className="flex flex-col lg:flex-1 lg:overflow-hidden">
                <CategoryTabs 
                    categories={['All', ...systemSettings.categories]} 
                    selectedCategory={selectedCategory} 
                    onSelectCategory={setSelectedCategory} 
                />
                <ProductGrid 
                    products={filteredProducts} 
                    onAddToCart={handleAddToCart}
                    currencySymbol={systemSettings.currencySymbol}
                />
            </main>
            <OrderPanel
                orderItems={currentOrder}
                subtotal={subtotal}
                discountTotal={discountTotal}
                tax={tax}
                total={total}
                taxRate={systemSettings.taxRate}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearOrder={handleClearOrder}
                onProcessPayment={handleInitiatePayment}
                onApplyDiscount={handleApplyDiscount}
                currencySymbol={systemSettings.currencySymbol}
                secondaryCurrencySymbol={systemSettings.secondaryCurrencySymbol}
                exchangeRate={systemSettings.exchangeRate}
            />
        </div>
      ) : (
        <AdminPanel 
          products={products}
          orderHistory={orderHistory}
          users={users}
          currentUser={currentUser}
          systemSettings={systemSettings}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={() => setAddProductModalOpen(true)}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onViewOrderDetails={handleViewOrderDetails}
          onUpdateSettings={handleUpdateSettings}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          currencySymbol={systemSettings.currencySymbol}
        />
      )}

      <ReceiptModal 
        isOpen={isReceiptModalOpen} 
        onClose={handleNewSale}
        order={lastCompletedOrder}
        storeLogoUrl={systemSettings.storeLogoUrl}
        storeAddress={systemSettings.storeAddress}
        receiptMessage={systemSettings.receiptMessage}
        currencySymbol={systemSettings.currencySymbol}
      />
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        categories={systemSettings.categories}
      />
      <BakongQRModal
        isOpen={isBakongModalOpen}
        onClose={() => setBakongModalOpen(false)}
        onConfirm={handleConfirmPayment}
        total={total}
        currencySymbol={systemSettings.currencySymbol}
        secondaryCurrencySymbol={systemSettings.secondaryCurrencySymbol}
        exchangeRate={systemSettings.exchangeRate}
      />
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onProcessRefund={handleProcessRefund}
        storeLogoUrl={systemSettings.storeLogoUrl}
        storeAddress={systemSettings.storeAddress}
        receiptMessage={systemSettings.receiptMessage}
        currencySymbol={systemSettings.currencySymbol}
      />
    </div>
  );
};

export default App;
