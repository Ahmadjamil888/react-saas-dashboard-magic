import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Star, 
  Truck, 
  Shield, 
  Award, 
  Users, 
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  MessageCircle
} from 'lucide-react';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import AdminPanel from '../components/AdminPanel';
import AuthModal from '../components/AuthModal';
import ProductDetail from '../components/ProductDetail';
import { ThemeToggle } from '../components/ThemeToggle';

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

const Index = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    price: 0,
    description: '',
    image: '',
  });

  useEffect(() => {
    // Load products from local storage or fetch from API
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Mock products for demonstration
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Smartwatch',
          price: 299,
          description: 'The ultimate smartwatch for fitness tracking and smart notifications.',
          image: 'photo-1523275335684-37898b6baf0c',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Wireless Noise Cancelling Headphones',
          price: 199,
          description: 'Immerse yourself in sound with these high-quality noise cancelling headphones.',
          image: 'photo-1505740420928-5e560ba3e51d',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Ergonomic Office Chair',
          price: 349,
          description: 'Stay comfortable and productive with this ergonomic office chair.',
          image: 'photo-1560343090-f04029528ccb',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Mechanical Gaming Keyboard',
          price: 129,
          description: 'Dominate your games with this responsive mechanical gaming keyboard.',
          image: 'photo-1567016544370-463ce781b815',
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: '4K Ultra HD Monitor',
          price: 499,
          description: 'Experience stunning visuals with this 4K Ultra HD monitor.',
          image: 'photo-1586952522435-6119039e221e',
          createdAt: new Date().toISOString(),
        },
        {
          id: '6',
          name: 'Portable Bluetooth Speaker',
          price: 79,
          description: 'Enjoy your music anywhere with this portable Bluetooth speaker.',
          image: 'photo-1542393458-709364ed512b',
          createdAt: new Date().toISOString(),
        },
      ];
      setProducts(mockProducts);
      localStorage.setItem('products', JSON.stringify(mockProducts));
    }

    // Load cart from local storage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Check if user is admin (for demonstration purposes)
    const storedIsAdmin = localStorage.getItem('isAdmin');
    if (storedIsAdmin) {
      setIsAdmin(JSON.parse(storedIsAdmin));
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', localStorage.theme === 'dark');
  }, []);

  const addToCart = (productId: string) => {
    const existingCartItem = cart.find(item => item.productId === productId);
    if (existingCartItem) {
      const updatedCart = cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { productId, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    toast({
      title: "Item added to cart!",
      description: "Check your cart to proceed to checkout.",
    })
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const createProduct = () => {
    const newProductId = Math.random().toString(36).substring(2, 15);
    const productToAdd: Product = {
      id: newProductId,
      ...newProduct,
      createdAt: new Date().toISOString(),
    };
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      image: '',
    });
    setShowAdminPanel(false);
    toast({
      title: "Product Created!",
      description: "The product has been successfully created.",
    })
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({
      title: "Product Deleted!",
      description: "The product has been successfully deleted.",
    })
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    clearCart();
    setShowCheckout(false);
    toast({
      title: "Thank you for your order!",
      description: "Your order has been placed successfully.",
    })
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
  };

  const toggleAuthModal = (type: 'login' | 'register') => {
    setAuthType(type);
    setShowAuthModal(!showAuthModal);
  };

  const handleAuth = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', JSON.stringify(true));
      setShowAuthModal(false);
      toast({
        title: "Login Successful!",
        description: "You are now logged in as an administrator.",
      })
    } else {
      toast({
        title: "Login Failed!",
        description: "Please check your credentials and try again.",
      })
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    toast({
      title: "Logout Successful!",
      description: "You have been successfully logged out.",
    })
  };

  // Show product detail if we're on a product page
  if (productId) {
    return (
      <ProductDetail
        products={products}
        cart={cart}
        onAddToCart={addToCart}
        onBuyNow={(id) => {
          addToCart(id);
          setShowCheckout(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechStore
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                Products
              </a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost">
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 rounded-full px-1.5 py-0 text-xs font-medium ring-2 ring-white dark:ring-gray-900">
                  {cart.length}
                </Badge>
                <span className="sr-only">View Cart</span>
              </Button>
              {isAdmin ? (
                <>
                  <Button onClick={toggleAdminPanel} variant="secondary">
                    Admin Panel
                  </Button>
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => toggleAuthModal('login')} variant="secondary">
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507883245204-4b1c29d0c70b?w=1920&q=75"
            alt="Hero Background"
            className="w-full h-full object-cover animate- Kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-blue-900/60 dark:to-purple-900/60" />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Welcome to TechStore
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            Your one-stop shop for the latest tech gadgets and accessories.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center p-6 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                10+ Years
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experience in the industry
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center p-6 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                500K+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Happy customers worldwide
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center p-6 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300 mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                99.9%
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Uptime guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-screen h-1/2 bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-900/30" />
          <div className="absolute right-0 bottom-1/2 transform translate-y-1/2 w-screen h-1/2 bg-gradient-to-l from-purple-100 to-transparent dark:from-purple-900/30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Why Choose TechStore?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer a wide selection of high-quality products, competitive prices, and exceptional customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fast & Free Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your products delivered quickly and for free on orders over $50.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We use the latest encryption technology to ensure your payments are safe and secure.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-orange-100 dark:bg-orange-900 rounded-full text-orange-600 dark:text-orange-300 mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                24/7 Customer Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our dedicated support team is available around the clock to assist you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our curated collection of premium products designed for modern living
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fade-in 0.6s ease-out forwards'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=400&h=300&fit=crop&crop=center`}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    New
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4 line-clamp-2">
                    {product.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${(product.price * 1.2).toFixed(2)}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      17% OFF
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
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
      <section id="testimonials" className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Read what our satisfied customers have to say about their experience with TechStore.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b2933e?w=50&h=50&fit=crop&crop=faces"
                  alt="Customer 1"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sarah Johnson
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    New York, NY
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "I love shopping at TechStore! They have a great selection of products and the customer service is excellent."
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=faces"
                  alt="Customer 2"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Michael Davis
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Los Angeles, CA
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "TechStore is my go-to for all things tech. The prices are competitive and the shipping is always fast."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white opacity-80 max-w-3xl mx-auto mb-12">
            Explore our wide range of tech products and find the perfect gadgets for your needs.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300">
              View Products
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {new Date().getFullYear()} TechStore. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
          onUpdateCart={updateCart}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutForm
          cart={cart}
          products={products}
          onClose={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel
          products={products}
          newProduct={newProduct}
          setNewProduct={(value) => setNewProduct(value)}
          onCreateProduct={createProduct}
          onDeleteProduct={deleteProduct}
          onClose={toggleAdminPanel}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          type={authType}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}
    </div>
  );
};

export default Index;
