
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  createdAt: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  products: Product[];
  onClose: () => void;
  onCheckout: () => void;
  onUpdateCart: (cart: CartItem[]) => void;
}

const Cart = ({ cart, products, onClose, onCheckout, onUpdateCart }: CartProps) => {
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const newCart = cart.filter(item => item.productId !== productId);
      onUpdateCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    } else {
      const newCart = cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      onUpdateCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white dark:bg-slate-800 shadow-2xl">
        <CardHeader className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 hover:bg-white/50"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Shopping Cart
          </CardTitle>
          <CardDescription>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96 p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-600">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">${product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Badge variant="secondary" className="min-w-[2rem] text-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {item.quantity}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right min-w-[4rem]">
                      <p className="font-medium text-gray-900 dark:text-white">${(product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-600">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button 
              onClick={onCheckout} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all" 
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Cart;
