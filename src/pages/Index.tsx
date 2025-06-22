
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Users, Package, TrendingUp } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import Cart from '@/components/Cart';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

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

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'login'>('signin');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with some sample products
      const initialProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Laptop',
          price: 1299,
          description: 'High-performance laptop for professionals',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Wireless Headphones',
          price: 199,
          description: 'Noise-cancelling bluetooth headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Smart Watch',
          price: 299,
          description: 'Advanced fitness and health tracking',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          createdAt: new Date().toISOString()
        }
      ];
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleAuth = (email: string, password: string, name?: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (authMode === 'signin') {
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        toast({
          title: "Error",
          description: "User already exists. Please log in instead.",
          variant: "destructive"
        });
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        password,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setShowAuthModal(false);
      toast({
        title: "Welcome!",
        description: "Thanks for creating an account!"
      });
    } else {
      // Login - Check for admin first
      if (email === 'admin@gmail.com' && password === 'PASSWORD') {
        const adminUser: User = {
          id: 'admin',
          email: 'admin@gmail.com',
          password: 'PASSWORD',
          name: 'Admin',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        setCurrentUser(adminUser);
        setShowAuthModal(false);
        setShowAdminPanel(true);
        
        toast({
          title: "Welcome back Admin!",
          description: "Successfully logged in!"
        });
        return;
      }
      
      // Check regular users
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        setShowAuthModal(false);
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in!"
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowAdminPanel(false);
    toast({
      title: "Logged out",
      description: "Successfully logged out!"
    });
  };

  const addToCart = (productId: string) => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { productId, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast({
      title: "Added to cart",
      description: "Item added successfully!"
    });
  };

  const checkout = () => {
    if (cart.length === 0) return;

    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      userId: currentUser!.id,
      items: [...cart],
      total,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setShowCart(false);
    
    toast({
      title: "Order placed!",
      description: `Your order of $${total.toFixed(2)} has been placed successfully!`
    });
  };

  if (showAdminPanel && currentUser?.email === 'admin@gmail.com') {
    return (
      <AdminPanel 
        onClose={() => setShowAdminPanel(false)}
        products={products}
        setProducts={setProducts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TechStore</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCart(true)}
                    className="relative"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                  {currentUser.email === 'admin@gmail.com' && (
                    <Button onClick={() => setShowAdminPanel(true)} variant="outline" size="sm">
                      Admin Panel
                    </Button>
                  )}
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                    variant="outline"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  >
                    Log In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">TechStore</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the latest in technology with our curated collection of premium products. 
            From laptops to accessories, we have everything you need.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trusted by Thousands</h3>
              <p className="text-gray-600">Join our growing community of satisfied customers</p>
            </div>
            <div className="text-center">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Premium Products</h3>
              <p className="text-gray-600">Carefully selected high-quality tech products</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{product.name}</span>
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  </CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">(4.9)</span>
                    </div>
                    <Button onClick={() => addToCart(product.id)} size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <Cart
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onCheckout={checkout}
          onUpdateCart={setCart}
        />
      )}
    </div>
  );
};

export default Index;
