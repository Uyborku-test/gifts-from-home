import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Order } from '@/types';
import { mockOrders } from '@/data/mockData';
import LoadingSpinner from './LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ');
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Kutilmoqda',
          icon: Clock,
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          borderColor: 'border-warning/30',
        };
      case 'confirmed':
        return {
          label: 'Tasdiqlangan',
          icon: CheckCircle,
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          borderColor: 'border-primary/30',
        };
      case 'delivered':
        return {
          label: 'Yetkazildi',
          icon: Truck,
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          borderColor: 'border-success/30',
        };
      case 'cancelled':
        return {
          label: 'Bekor qilindi',
          icon: XCircle,
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          borderColor: 'border-destructive/30',
        };
      default:
        return {
          label: 'Noma\'lum',
          icon: Package,
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          borderColor: 'border-muted',
        };
    }
  };

  if (loading) {
    return <LoadingSpinner text="Buyurtmalar yuklanmoqda..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Buyurtmalar yo'q
        </h2>
        <p className="text-sm text-muted-foreground">
          Hali hech qanday buyurtma bermagansiz
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h2 className="text-lg font-semibold text-foreground">
        Buyurtmalar tarixi
      </h2>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl bg-card shadow-card animate-fade-in"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Buyurtma #{order.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.created_at}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                >
                  <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.textColor}`} />
                  <span className={`text-xs font-medium ${statusConfig.textColor}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4">
                <div className="flex flex-col gap-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={
                            item.product.images?.[0]?.file_path ||
                            'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'
                          }
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-foreground">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x {formatPrice(item.product.price)} so'm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Jami:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(order.total)} so'm
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
