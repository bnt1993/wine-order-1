
import React from 'react';
import { X, ShoppingCart, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onViewFullDetail: (p: Product) => void;
}

const QuickViewModal: React.FC<Props> = ({ product, isOpen, onClose, onAddToCart, onViewFullDetail }) => {
  if (!isOpen || !product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-secondary/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-stone-100 rounded-full text-brand-secondary hover:bg-brand-primary hover:text-white transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-stone-50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-brand-accent text-brand-secondary text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {product.category}
          </div>
        </div>

        {/* Right: Quick Info */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-brand-accent text-brand-accent" />
            ))}
            <span className="text-[10px] font-black text-brand-secondary ml-2">5.0 (120+)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand-secondary mb-4 leading-tight">
            {product.name}
          </h2>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-black text-brand-primary">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-gray-300 line-through font-bold">
              {formatCurrency(product.price * 1.25)}
            </span>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-6">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
              "{product.description}"
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-[10px] font-black text-brand-secondary uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Cam kết ủ lâu năm
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-brand-secondary uppercase tracking-widest">
              <Zap className="w-4 h-4 text-brand-accent" /> Giao nhanh nội thành
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
            </button>
            <button 
              onClick={() => onViewFullDetail(product)}
              className="w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 hover:bg-brand-accent/5 transition-all flex items-center justify-center gap-2"
            >
              Xem chi tiết đầy đủ <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
