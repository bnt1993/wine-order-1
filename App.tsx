
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AIConsultant from './components/AIConsultant';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import FilterDrawer from './components/FilterDrawer';
import Testimonials from './components/Testimonials';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { logVisitor } from './services/supabase';
import { Product, Category } from './types';
import { 
  Heart, Facebook, Instagram, Youtube, Lock, Phone, MapPin, Mail, 
  ArrowRight, ShieldCheck, SlidersHorizontal, Sparkles, Star, ChevronRight,
  CheckCircle2
} from 'lucide-react';

const App: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems, total_price, clearCart } = useCart();
  const { products, loading: productsLoading } = useProducts();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  // Filter States
  const [activeCategory, setActiveCategory] = useState<string>('Tất Cả');
  const [priceRange, setPriceRange] = useState<string>('Tất Cả');

  // Suggested Products State
  const [suggestedProducts, setSuggestedProducts] = useState<(Product & { reason?: string })[]>([]);

  const categories = ['Tất Cả', ...Object.values(Category)];
  const priceRanges = [
    { label: 'Tất Cả', min: 0, max: Infinity },
    { label: 'Dưới 500k', min: 0, max: 500000 },
    { label: '500k - 1tr', min: 500000, max: 1000000 },
    { label: '1tr - 2tr', min: 1000000, max: 2000000 },
    { label: 'Trên 2tr', min: 2000000, max: Infinity },
  ];

  const reasons = [
    "Phù hợp làm quà biếu",
    "Bồi bổ sức khỏe toàn diện",
    "Bán chạy nhất tuần qua",
    "Dành cho người cao tuổi",
    "Hương vị êm dịu dễ uống"
  ];

  // LOG VISITOR ON MOUNT
  useEffect(() => {
    logVisitor();
  }, []);

  const shuffleSuggestions = useCallback(() => {
    if (products.length > 0) {
      const shuffled = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(p => ({
          ...p,
          reason: reasons[Math.floor(Math.random() * reasons.length)]
        }));
      setSuggestedProducts(shuffled);
    }
  }, [products]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        handleAdminRedirect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    shuffleSuggestions();
    const intervalId = setInterval(() => {
      shuffleSuggestions();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [shuffleSuggestions]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
    setIsDetailOpen(false);
    setIsCartOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = activeCategory === 'Tất Cả' || product.category === activeCategory;
      const range = priceRanges.find(r => r.label === priceRange) || priceRanges[0];
      const priceMatch = product.price >= range.min && product.price < range.max;
      return categoryMatch && priceMatch;
    });
  }, [activeCategory, priceRange, products]);

  const resetFilters = () => {
    setActiveCategory('Tất Cả');
    setPriceRange('Tất Cả');
  };

  const handleAdminRedirect = () => {
    window.location.href = 'admin.html';
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-brand-light">
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartCount={totalItems} />
      
      <main>
        <Hero />

        {/* Suggested Products Section */}
        <section className="py-16 sm:py-20 bg-brand-soft border-y border-stone-100 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent">Thanh Hà Tuyển Chọn</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-brand-secondary">Gợi Ý <span className="text-brand-accent">Hôm Nay</span></h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {suggestedProducts.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => handleViewDetails(p)}
                  className="bg-white p-4 sm:p-5 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all border border-stone-100 group cursor-pointer animate-in fade-in zoom-in-95 duration-700"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-2.5 left-2.5 bg-brand-secondary/90 backdrop-blur-md text-white text-[7px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                      {p.reason}
                    </div>
                  </div>
                  <h4 className="text-[10px] sm:text-xs font-black text-brand-secondary mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors uppercase tracking-tight">{p.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-brand-primary font-black text-xs sm:text-sm">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</p>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Catalog */}
        <section id="products" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
             <header className="flex flex-col items-center mb-12 text-center">
              <div className="w-full flex items-center justify-between mb-8 sm:justify-center sm:gap-6">
                <div className="flex flex-col items-start sm:items-center">
                  <h2 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-black text-brand-secondary leading-tight">
                    Danh Mục <span className="text-brand-accent">Sản Phẩm</span>
                  </h2>
                </div>
                
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-brand-secondary hover:bg-brand-accent hover:text-white transition-all shadow-sm active:scale-90"
                  aria-label="Mở bộ lọc"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full flex overflow-x-auto gap-2 scrollbar-hide pb-4 snap-x snap-mandatory">
                {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`snap-start flex-shrink-0 px-5 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-brand-secondary text-white shadow-xl scale-105' 
                        : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {priceRange !== 'Tất Cả' && (
                <div className="mt-2 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                  <span className="text-[8px] font-black text-brand-accent uppercase tracking-[0.2em]">Khoảng giá: {priceRange}</span>
                  <button onClick={() => setPriceRange('Tất Cả')} className="p-1 text-stone-300 hover:text-red-500"><Lock className="w-3 h-3 rotate-45" /></button>
                </div>
              )}
            </header>

            {productsLoading ? (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-50 rounded-3xl animate-pulse" />
                ))}
               </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {!productsLoading && filteredProducts.length === 0 && (
              <div className="py-20 text-center opacity-40">
                <p className="text-xs font-black uppercase tracking-widest">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={resetFilters} className="mt-4 text-brand-accent font-black text-[9px] uppercase underline">Xóa tất cả bộ lọc</button>
              </div>
            )}
          </div>
        </section>

        <AIConsultant />
        <Testimonials />
      </main>

      {/* Toast Notification */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[250] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-brand-secondary/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-brand-accent/20 min-w-[280px]">
          <div className="w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center text-brand-secondary shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Thành công</p>
            <p className="text-[9px] font-bold text-white/70 line-clamp-1">{toast.message}</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer id="contact" className="bg-brand-secondary text-white pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-accent p-2 rounded-lg">
                   <Heart className="w-5 h-5 text-brand-secondary fill-current" />
                </div>
                <span className="text-xl font-serif font-black tracking-widest uppercase">THANH HÀ</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed mb-6 italic">
                "Khơi nguồn sức khỏe từ tinh túy thảo dược thiên nhiên Nông Cống, Thanh Hóa. Hành trình hơn 20 năm gìn giữ và phát huy di sản Dược Tửu Việt."
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-stone-400 hover:bg-brand-accent hover:text-brand-secondary transition-all">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent mb-6">Khám Phá</h4>
              <ul className="space-y-3">
                {['Về Thanh Hà', 'Tất cả sản phẩm', 'Chính sách đại lý', 'Kiến thức sức khỏe'].map((item) => (
                  <li key={item}>
                    <button className="text-stone-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 text-brand-accent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent mb-6">Liên Hệ Trực Tiếp</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-accent flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-brand-accent tracking-widest mb-1">Cơ sở sản xuất</p>
                    <p className="text-[10px] font-bold text-stone-300 leading-relaxed">Tiên Lương, Minh Nghĩa, Nông Cống, Thanh Hóa</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-accent flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-brand-accent tracking-widest mb-1">Hotline 24/7</p>
                    <p className="text-lg font-serif font-black text-white">0383.759.586</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-[8px] font-black text-stone-500 uppercase tracking-widest">
              <span>© 2024 RƯỢU NGÂM THANH HÀ</span>
              <span className="w-1 h-1 bg-brand-accent rounded-full"></span>
              <span>MST: 2801234567</span>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Sản phẩm đạt chuẩn ATTP</span>
               </div>
               <button 
                onClick={handleAdminRedirect}
                className="p-1 text-stone-700 hover:text-stone-500 transition-colors"
                title="Hệ thống quản trị"
               >
                <Lock className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} total_price={total_price} clearCart={clearCart} />
      <ProductDetailModal isOpen={isDetailOpen} product={selectedProduct} onClose={() => setIsDetailOpen(false)} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} activeCategory={activeCategory} setActiveCategory={setActiveCategory} priceRange={priceRange} setPriceRange={setPriceRange} categories={categories} priceRanges={priceRanges} resetFilters={resetFilters} totalResults={filteredProducts.length} />
    </div>
  );
};

export default App;
