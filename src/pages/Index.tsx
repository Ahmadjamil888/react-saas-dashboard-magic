import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Users, Package, TrendingUp, Sparkles, Zap, Shield } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import Cart from '@/components/Cart';
import CheckoutForm from '@/components/CheckoutForm';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
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
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  products?: any[];
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'login'>('signin');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderComplete = (orderData: any) => {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

    const newOrder: Order = {
      id: Date.now().toString(),
      userId: currentUser!.id,
      items: [...cart],
      total: orderData.total,
      createdAt: new Date().toISOString(),
      status: 'completed',
      customerInfo: {
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        zipCode: orderData.zipCode
      },
      products: orderData.products
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setShowCheckout(false);
    
    toast({
      title: "Order placed successfully! 🎉",
      description: `Thank you for your order of $${orderData.total.toFixed(2)}. We'll process it soon!`
    });
  };

  if (showAdminPanel && currentUser?.email === 'admin@gmail.com') {
    return (
      <ThemeProvider>
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)}
          products={products}
          setProducts={setProducts}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {/* Enhanced Header with Glass Effect */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TechStore</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Premium Tech</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                
                {currentUser ? (
                  <>
                    <div className="hidden sm:block">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, <span className="font-medium">{currentUser.name}</span></span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCart(true)}
                      className="relative hover:scale-105 transition-transform"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-bounce">
                          {cart.length}
                        </Badge>
                      )}
                    </Button>
                    {currentUser.email === 'admin@gmail.com' && (
                      <Button onClick={() => setShowAdminPanel(true)} variant="outline" size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:scale-105 transition-transform">
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
                      className="hover:scale-105 transition-transform"
                    >
                      Sign Up
                    </Button>
                    <Button 
                      onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all"
                    >
                      Log In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section with Parallax Effect */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Parallax Background Elements */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  TechStore
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover the latest in premium technology with our curated collection. 
                From cutting-edge laptops to innovative accessories — we have everything you need.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Premium Quality
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
                  <Zap className="w-4 h-4 mr-2" />
                  Fast Delivery
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure Shopping
                </Badge>
              </div>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                { icon: Users, title: "Trusted by Thousands", desc: "Join our growing community of satisfied customers", gradient: "from-blue-500 to-cyan-500" },
                { icon: Package, title: "Premium Products", desc: "Carefully selected high-quality tech products", gradient: "from-purple-500 to-pink-500" },
                { icon: TrendingUp, title: "Fast Delivery", desc: "Quick and reliable shipping worldwide", gradient: "from-green-500 to-blue-500" }
              ].map((feature, index) => (
                <Card key={index} className="group hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.gradient} p-4 group-hover:rotate-12 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Products Section */}
        <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Handpicked items just for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 border-0 shadow-lg hover:scale-105">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg">{product.name}</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">(4.9)</span>
                      </div>
                      <Button 
                        onClick={() => addToCart(product.id)} 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Package className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">TechStore</span>
            </div>
            <p className="text-gray-400 mb-4">© 2024 TechStore. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Delivering premium technology worldwide</p>
          </div>
        </footer>

        {/* Modals */}
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onAuth={handleAuth}
          />
        )}

        {showCart && (
          <Cart
            cart={cart}
            products={products}
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
            onUpdateCart={setCart}
          />
        )}

        {showCheckout && (
          <CheckoutForm
            cart={cart}
            products={products}
            currentUser={currentUser}
            onClose={() => setShowCheckout(false)}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
