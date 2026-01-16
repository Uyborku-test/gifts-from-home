import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { TelegramUtils } from '@/utils/telegram';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

const ProductCard = ({ product, onAddToCart, isInCart = false }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];
  const imageUrl = mainImage?.file_path || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    TelegramUtils.hapticFeedback('medium');
    setIsAdding(true);
    onAddToCart(product);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-elevated tap-highlight-none animate-fade-in">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/50" />
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className={`h-full w-full object-cover product-image-hover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
            <span>{product.category.icon}</span>
            <span className="text-foreground/80">{product.category.name}</span>
          </div>
        )}

        {/* New Badge */}
        <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
          Yangi
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
            isInCart || isAdding
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-primary hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          {isInCart || isAdding ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Price */}
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">{product.currency}</span>
        </div>

        {/* Name */}
        <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
          {product.name}
        </h3>

        {/* Rating Placeholder */}
        <div className="mt-auto flex items-center gap-1 pt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-xs text-warning">★</span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">5.0</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
