import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product, Category } from '@/types';
import { mockProducts, mockCategories } from '@/data/mockData';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import { TelegramUtils } from '@/utils/telegram';

interface ProductsPageProps {
  onAddToCart: (product: Product) => void;
  cartItems: { product: Product; quantity: number }[];
}

const ProductsPage = ({ onAddToCart, cartItems }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 1) {
      filtered = filtered.filter(p => p.category?.id === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.product.id === productId);
  };

  const handleCategoryChange = (categoryId: number) => {
    TelegramUtils.hapticSelection();
    setSelectedCategory(categoryId);
  };

  const clearSearch = () => {
    setSearchQuery('');
    TelegramUtils.hapticFeedback('light');
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Mahsulot qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-foreground shadow-card hover:bg-accent'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} ta mahsulot topildi
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner text="Mahsulotlar yuklanmoqda..." />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isInCart={isInCart(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-6xl">🔍</span>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Hozircha mahsulotlar yo'q
          </h3>
          <p className="text-sm text-muted-foreground">
            Boshqa kategoriyani tanlang yoki qidiruv so'zini o'zgartiring
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
