
import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Phone, Heart, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  onOpenCart: () => void;
  cartCount: number;
}

const Navbar: React.FC<Props> = ({ onOpenCart, cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    setIsOpen(false);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl h-16 sm:h-20 shadow-sm border-b border-brand-accent/10' : 'bg-transparent h-20 sm:h-28'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo - Refined for professional look */}
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-3 sm:gap-4 group">
              <div className="bg-brand-primary p-2 sm:p-2.5 rounded-xl shadow-lg shadow-brand-primary/20 transform group-hover:rotate-6 transition-transform">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-xl sm:text-2xl font-serif font-black tracking-tighter leading-none transition-colors ${scrolled ? 'text-brand-secondary' : 'text-brand-secondary'}`}>THANH HÀ</span>
                <span className="text-[7px] sm:text-[9px] tracking-[0.3em] uppercase text-brand-accent font-bold mt-0.5">Tinh hoa dược tửu</span>
              </div>
            </button>
            
            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={onOpenCart} 
                className={`group p-2.5 sm:p-3 rounded-xl transition-all relative flex items-center gap-2 ${scrolled ? 'hover:bg-brand-accent/10' : 'bg-white/40 hover:bg-white/60 backdrop-blur-sm'}`}
                aria-label="Giỏ hàng"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-brand-secondary" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-lg shadow-md border border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block text-[10px] font-black text-brand-secondary uppercase tracking-widest">Giỏ hàng</span>
              </button>

              <a href="tel:0383759586" className="hidden sm:flex items-center gap-2 bg-brand-accent text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all shadow-md shadow-brand-accent/10">
                <Phone className="w-4 h-4" />
                <span>0383.759.586</span>
              </a>

              <button 
                onClick={() => setIsOpen(true)} 
                className={`p-2.5 sm:p-3 rounded-xl active:scale-95 transition-transform ${scrolled ? 'bg-stone-50 text-brand-secondary' : 'bg-white/40 backdrop-blur-sm text-brand-secondary'}`}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[150] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-brand-secondary/30 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        
        <div className={`absolute right-0 top-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 ease-out transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-stone-100">
             <div className="flex flex-col">
                <span className="text-xl font-serif font-black text-brand-secondary uppercase">THANH HÀ</span>
                <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest mt-1">Nâng tầm sức khỏe</span>
             </div>
             <button 
              onClick={() => setIsOpen(false)}
              className="p-3 bg-stone-50 rounded-xl text-brand-secondary active:scale-95"
             >
               <X className="w-5 h-5" />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 no-scrollbar">
            {['Trang Chủ', 'Sản Phẩm', 'Tư Vấn AI', 'Liên Hệ'].map((label, idx) => {
              const ids = ['home', 'products', 'consult', 'contact'];
              return (
                <button 
                  key={label}
                  onClick={() => scrollToSection(ids[idx])}
                  className="flex items-center justify-between p-5 rounded-xl bg-brand-soft text-brand-secondary active:bg-brand-accent/10 transition-all text-left group"
                >
                  <span className="text-lg font-serif font-black group-hover:text-brand-accent transition-colors">{label}</span>
                  <ChevronRight className="w-4 h-4 text-brand-accent" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
