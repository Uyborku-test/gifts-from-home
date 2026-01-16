import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/types';
import { TelegramUtils } from '@/utils/telegram';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onNavigate: (page: string) => void;
}

const CartPage = ({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }: CartPageProps) => {
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderComment, setOrderComment] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ');
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    const item = cartItems.find(i => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        TelegramUtils.hapticFeedback('light');
        onUpdateQuantity(productId, newQuantity);
      }
    }
  };

  const handleRemove = (productId: number) => {
    TelegramUtils.hapticFeedback('medium');
    onRemoveItem(productId);
  };

  const handleOrder = () => {
    if (!orderPhone.trim() || !orderAddress.trim()) {
      TelegramUtils.hapticNotification('warning');
      return;
    }
    TelegramUtils.hapticNotification('success');
    alert('Buyurtma qabul qilindi! Tez orada siz bilan bog\'lanamiz.');
    setShowOrderForm(false);
    setOrderPhone('');
    setOrderAddress('');
    setOrderComment('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Savatcha bo'sh</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Mahsulotlarni ko'rib chiqing va savatchaga qo'shing
        </p>
        <button
          onClick={() => {
            TelegramUtils.hapticFeedback('light');
            onNavigate('products');
          }}
          className="gradient-primary rounded-xl px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all active:scale-95"
        >
          Mahsulotlarni ko'rish
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Cart Items */}
      <div className="flex flex-col gap-3">
        {cartItems.map((item) => {
          const mainImage = item.product.images?.find(img => img.is_main) || item.product.images?.[0];
          const imageUrl = mainImage?.file_path || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

          return (
            <div
              key={item.product.id}
              className="flex gap-3 rounded-xl bg-card p-3 shadow-card animate-fade-in"
            >
              {/* Image */}
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                    {item.product.name}
                  </h3>
                  <p className="mt-1 text-base font-bold text-primary">
                    {formatPrice(item.product.price)} {item.product.currency}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Form */}
      {showOrderForm && (
        <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground">Buyurtma ma'lumotlari</h3>
          <input
            type="tel"
            placeholder="Telefon raqam *"
            value={orderPhone}
            onChange={(e) => setOrderPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Manzil *"
            value={orderAddress}
            onChange={(e) => setOrderAddress(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <textarea
            placeholder="Izoh (ixtiyoriy)"
            value={orderComment}
            onChange={(e) => setOrderComment(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}

      {/* Summary */}
      <div className="rounded-xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Jami:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(totalAmount)} so'm
          </span>
        </div>
      </div>

      {/* Order Button */}
      {showOrderForm ? (
        <div className="flex gap-3">
          <button
            onClick={() => setShowOrderForm(false)}
            className="flex-1 rounded-xl border border-border bg-card py-4 font-semibold text-foreground transition-all active:scale-[0.98]"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleOrder}
            className="gradient-primary flex-1 rounded-xl py-4 font-semibold text-primary-foreground shadow-lg transition-all active:scale-[0.98]"
          >
            Tasdiqlash
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            TelegramUtils.hapticFeedback('light');
            setShowOrderForm(true);
          }}
          className="gradient-primary rounded-xl py-4 font-semibold text-primary-foreground shadow-lg transition-all active:scale-[0.98]"
        >
          Buyurtma berish
        </button>
      )}
    </div>
  );
};

export default CartPage;
