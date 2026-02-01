
import React, { useState } from 'react';
import { ShoppingCart, Star, Zap, Eye, Plus, Minus, ShieldCheck, Share2, Check } from 'lucide-react';
import { Product } from '../types';

interface Props {
  product: Product;
  onAddToCart: (p: Product, q: number) => void;
  onBuyNow: (p: Product, q: number) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart, onBuyNow, onViewDetails }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isShared, setIsShared] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const shareData = {
      title: product.name,
      text: product.description,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error('Lỗi khi chia sẻ:', err);
    }
  };

  return (
    <article 
      className="group bg-white rounded-xl sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 flex flex-col h-full relative"
    >
      {/* Visual Section */}
      <div 
        className={`relative aspect-square overflow-hidden transition-colors duration-500 cursor-pointer ${isLoaded ? 'bg-transparent' : 'bg-stone-50 animate-pulse'}`}
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={`${product.name} - Rượu Ngâm Thanh Hà cao cấp`} 
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Subtle Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center z-20 pointer-events-none group-hover:pointer-events-auto">
          <div className="w-12 h-12 bg-white/95 text-brand-secondary rounded-full flex items-center justify-center shadow-lg">
            <Eye className="w-5 h-5" />
          </div>
        </div>
        
        {/* Share Button */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30">
          <button 
            onClick={handleShare}
            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full transition-all shadow-md flex items-center justify-center active:scale-90 ${isShared ? 'bg-green-500 text-white' : 'bg-white/90 text-brand-secondary'}`}
            aria-label="Chia sẻ sản phẩm"
          >
            {isShared ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        </div>

        {/* Minimal Badge */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          {product.badges?.some(b => b.toLowerCase().includes('bán chạy')) && (
            <div className="bg-red-600/90 text-white text-[5px] sm:text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 uppercase tracking-widest backdrop-blur-sm">
              <Zap className="w-2 h-2 fill-current" />
              HOT
            </div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-2.5 sm:p-6 lg:p-8 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-brand-accent text-brand-accent" />
            <span className="text-[7px] sm:text-[10px] font-black text-brand-secondary/50">5.0</span>
          </div>
          <div className="hidden sm:flex text-[8px] font-black text-green-600 uppercase tracking-widest items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-2.5 h-2.5" /> Kiểm định
          </div>
        </div>

        <h3 className="text-[10px] sm:text-base lg:text-xl font-serif font-black text-brand-secondary mb-1.5 line-clamp-2 leading-tight min-h-[2.5em] sm:min-h-[2em]">
          {product.name}
        </h3>
        
        {/* Pricing */}
        <div className="flex flex-col mb-3">
          <span className="text-xs sm:text-lg lg:text-2xl font-black text-brand-primary tracking-tight">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </span>
          <span className="text-[7px] sm:text-[10px] text-stone-300 line-through font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-stone-50 rounded-lg p-0.5 border border-stone-100">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center hover:text-brand-accent transition-colors"
                aria-label="Giảm"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
              <span className="px-1 text-[8px] sm:text-xs font-black text-brand-secondary min-w-[1rem] sm:min-w-[1.2rem] text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)} 
                className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center hover:text-brand-accent transition-colors"
                aria-label="Tăng"
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
            
            <button 
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1 h-6 sm:h-10 bg-brand-secondary text-white rounded-lg flex items-center justify-center hover:bg-brand-primary transition-all active:scale-95 shadow-sm"
              aria-label="Thêm vào giỏ"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => onBuyNow(product, quantity)}
            className="w-full bg-brand-accent text-brand-secondary h-7 sm:h-10 rounded-lg font-black uppercase tracking-widest text-[7px] sm:text-[10px] hover:shadow-md transition-all active:scale-95"
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
