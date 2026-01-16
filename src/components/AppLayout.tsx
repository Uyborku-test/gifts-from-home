import { useState, useEffect } from 'react';
import { Home, ShoppingBag, Package, ClipboardList } from 'lucide-react';
import { CartItem, Product } from '@/types';
import { TelegramUtils } from '@/utils/telegram';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import OrdersPage from './OrdersPage';

type PageType = 'home' | 'products' | 'cart' | 'orders';

const AppLayout = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    TelegramUtils.init();
  }, []);

  const handleNavigate = (page: string) => {
    TelegramUtils.hapticFeedback('light');
    setCurrentPage(page as PageType);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    TelegramUtils.hapticNotification('success');
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', icon: Home, label: 'Bosh sahifa' },
    { id: 'products', icon: ShoppingBag, label: 'Mahsulotlar' },
    { id: 'cart', icon: Package, label: 'Savatcha', badge: cartItemsCount },
    { id: 'orders', icon: ClipboardList, label: 'Buyurtmalar' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        );
      case 'products':
        return (
          <ProductsPage
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        );
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
          />
        );
      case 'orders':
        return <OrdersPage />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return '🏪 Do\'kon';
      case 'products':
        return '🛍️ Mahsulotlar';
      case 'cart':
        return '🛒 Savatcha';
      case 'orders':
        return '📦 Buyurtmalar';
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg safe-top">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-bottom">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-all tap-highlight-none active:scale-95 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <item.icon
                    className={`h-6 w-6 transition-all ${
                      isActive ? 'scale-110' : ''
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground badge-pulse">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
