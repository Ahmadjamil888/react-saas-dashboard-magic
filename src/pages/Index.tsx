
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Users, Package, TrendingUp, Sparkles, Zap, Shield, CheckCircle, Globe, Headphones, Award, ArrowRight, Quote } from 'lucide-react';
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
        title: "Welcome! 🎉",
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
          title: "Welcome back Admin! 👑",
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
          title: "Welcome back! 🚀",
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
        {/* Enhanced Header with Glass Effect */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-lg transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <Package className="h-10 w-10 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110 duration-300" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">TechStore</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Premium Tech Experience</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                {currentUser ? (
                  <>
                    <div className="hidden sm:block">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Welcome, <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{currentUser.name}</span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCart(true)}
                      className="relative hover:scale-110 transition-all duration-300 group"
                    >
                      <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-3 -right-3 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-lg">
                          {cart.length}
                        </Badge>
                      )}
                    </Button>
                    {currentUser.email === 'admin@gmail.com' && (
                      <Button onClick={() => setShowAdminPanel(true)} variant="outline" size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:scale-110 transition-all duration-300 shadow-lg">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    <Button onClick={handleLogout} variant="outline" size="sm" className="hover:scale-105 transition-all duration-300">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                      variant="outline"
                      className="hover:scale-110 transition-all duration-300 border-2 hover:border-blue-500"
                    >
                      Sign Up
                    </Button>
                    <Button 
                      onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      Log In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section with Advanced Parallax */}
        <section className="relative py-32 px-4 overflow-hidden">
          {/* Advanced Background Effects */}
          <div className="absolute inset-0 opacity-20 dark:opacity-10">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-3000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="animate-fade-in">
              <Badge className="mb-8 px-6 py-3 text-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-0 shadow-lg hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                New Collection Available
              </Badge>
              
              <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  TechStore
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed">
                Discover the future of technology with our premium collection. 
                From cutting-edge devices to innovative accessories — your tech journey starts here.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-20">
                <Badge variant="secondary" className="px-6 py-3 text-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Premium Quality
                </Badge>
                <Badge variant="secondary" className="px-6 py-3 text-lg bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 hover:scale-105 transition-transform duration-300">
                  <Zap className="w-5 h-5 mr-2" />
                  Lightning Fast Delivery
                </Badge>
                <Badge variant="secondary" className="px-6 py-3 text-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 hover:scale-105 transition-transform duration-300">
                  <Shield className="w-5 h-5 mr-2" />
                  Secure & Trusted
                </Badge>
              </div>

              <Button className="text-xl px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 group">
                Explore Collection
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
              {[
                { number: "50K+", label: "Happy Customers", icon: Users, gradient: "from-blue-500 to-cyan-500" },
                { number: "99.9%", label: "Uptime Guarantee", icon: CheckCircle, gradient: "from-green-500 to-blue-500" },
                { number: "24/7", label: "Expert Support", icon: Headphones, gradient: "from-purple-500 to-pink-500" }
              ].map((stat, index) => (
                <Card key={index} className="group hover:scale-105 transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${stat.gradient} p-5 group-hover:rotate-12 transition-transform duration-500`}>
                      <stat.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{stat.number}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Why Choose TechStore?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Experience the difference with our premium features and unmatched service quality
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, title: "Trusted Community", desc: "Join thousands of satisfied customers worldwide", gradient: "from-blue-500 to-cyan-500" },
                { icon: Package, title: "Premium Products", desc: "Carefully curated high-quality tech products", gradient: "from-purple-500 to-pink-500" },
                { icon: TrendingUp, title: "Fast Delivery", desc: "Lightning-fast shipping to your doorstep", gradient: "from-green-500 to-blue-500" },
                { icon: Award, title: "Award Winning", desc: "Recognized for excellence in customer service", gradient: "from-yellow-500 to-orange-500" }
              ].map((feature, index) => (
                <Card key={index} className="group hover:scale-110 transition-all duration-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.gradient} p-4 group-hover:rotate-12 transition-all duration-500 group-hover:scale-110`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-0">
                <Star className="w-4 h-4 mr-2" />
                Featured Collection
              </Badge>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Premium Products
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Handpicked items designed to elevate your tech experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product, index) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-3xl transition-all duration-500 bg-white dark:bg-slate-800 border-0 shadow-xl hover:scale-105 cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 animate-pulse">
                      New
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-start group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span className="text-xl">{product.name}</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform cursor-pointer" />
                        ))}
                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 font-medium">(4.9)</span>
                      </div>
                      <Button 
                        onClick={() => addToCart(product.id)} 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl px-6"
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

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Real reviews from our amazing community</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Johnson", role: "Tech Enthusiast", review: "Absolutely amazing quality and service! TechStore has become my go-to for all tech needs.", rating: 5 },
                { name: "Mike Chen", role: "Developer", review: "Fast delivery and premium products. The customer support is outstanding!", rating: 5 },
                { name: "Emily Davis", role: "Designer", review: "Love the user experience and product quality. Highly recommend TechStore!", rating: 5 }
              ].map((testimonial, index) => (
                <Card key={index} className="group hover:scale-105 transition-all duration-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                  <CardContent className="p-8">
                    <Quote className="h-8 w-8 text-blue-500 mb-4 opacity-50" />
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">"{testimonial.review}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
            <h2 className="text-6xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-2xl mb-10 opacity-90">Join thousands of satisfied customers today</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-110 transition-all duration-300 px-12 py-6 text-xl font-semibold shadow-2xl">
                Shop Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-110 transition-all duration-300 px-12 py-6 text-xl font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <Package className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl font-bold">TechStore</span>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  Your trusted partner for premium technology products. 
                  We deliver excellence in every purchase.
                </p>
                <div className="flex space-x-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-transform cursor-pointer">
                    <Globe className="w-4 h-4 mr-2" />
                    Worldwide Shipping
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform cursor-pointer">
                    <Shield className="w-4 h-4 mr-2" />
                    Secure Payment
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  {['About Us', 'Products', 'Support', 'Contact'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6">Support</h3>
                <ul className="space-y-3">
                  {['Help Center', 'Returns', 'Warranty', 'FAQ'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-lg">© 2024 TechStore. All rights reserved.</p>
              <p className="text-gray-500 mt-2">Delivering premium technology worldwide with excellence</p>
            </div>
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
