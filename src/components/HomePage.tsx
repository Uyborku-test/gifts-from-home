import { useState, useEffect } from 'react';
import { ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { mockProducts } from '@/data/mockData';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import { TelegramUtils } from '@/utils/telegram';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  cartItems: { product: Product; quantity: number }[];
}

const HomePage = ({ onNavigate, onAddToCart, cartItems }: HomePageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts.slice(0, 4));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.product.id === productId);
  };

  const handleViewProducts = () => {
    TelegramUtils.hapticFeedback('light');
    onNavigate('products');
  };

  const stats = [
    { icon: ShoppingBag, label: 'Mahsulotlar', value: '50+', color: 'bg-primary/10 text-primary' },
    { icon: Users, label: 'Mijozlar', value: '200+', color: 'bg-accent text-accent-foreground' },
    { icon: TrendingUp, label: 'Sotuvlar', value: '500+', color: 'bg-secondary text-secondary-foreground' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Hero Section */}
      <div className="gradient-hero relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-elevated">
        <div className="relative z-10">
          <h1 className="mb-2 text-2xl font-bold">Xush kelibsiz! 👋</h1>
          <p className="text-sm opacity-90">
            Xitoydan eng sifatli mahsulotlar, to'g'ridan-to'g'ri sizning eshigingizga
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 shadow-card transition-transform active:scale-95"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Featured Products Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">So'nggi mahsulotlar</h2>
          <button
            onClick={handleViewProducts}
            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Barchasi
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Mahsulotlar yuklanmoqda..." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isInCart={isInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleViewProducts}
        className="gradient-primary flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all active:scale-[0.98]"
      >
        <ShoppingBag className="h-5 w-5" />
        Mahsulotlarni ko'rish
      </button>
    </div>
  );
};

export default HomePage;
