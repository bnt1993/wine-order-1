
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, CheckCircle, ArrowRight, Star, Heart, ShieldCheck, Zap, Plus, Minus, MapPin, Wine, Calendar, Ruler, Info, Beaker, Percent, Share2, Timer, GlassWater } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product, q: number) => void;
  onBuyNow: (p: Product, q: number) => void;
}

const ProductDetailModal: React.FC<Props> = ({ product, isOpen, onClose, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'usage'>('desc');
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setActiveTab('desc');
      const others = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 2);
      if (others.length < 2) {
        const fallback = PRODUCTS.filter(p => p.id !== product.id).slice(0, 2);
        setFrequentlyBought(fallback);
      } else {
        setFrequentlyBought(others);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-secondary/95 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      <article className="relative w-full max-w-7xl bg-white rounded-t-[2.5rem] lg:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row h-[100dvh] lg:h-[92vh] animate-in slide-in-from-bottom-full duration-500 ease-out">
        
        {/* Floating Controls */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 lg:p-8 pointer-events-none">
          <button 
            onClick={onClose}
            className="pointer-events-auto p-3.5 bg-white/95 backdrop-blur-md rounded-2xl text-brand-secondary hover:bg-brand-secondary hover:text-white active:scale-90 transition-all shadow-xl border border-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex gap-2 pointer-events-auto">
            <button className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl text-brand-secondary shadow-xl active:scale-90 transition-all border border-stone-100">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl text-red-500 shadow-xl active:scale-90 transition-all border border-stone-100">
              <Heart className="w-5 h-5 hover:fill-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* 1. Image Section - Optimised mobile height */}
        <div className="w-full lg:w-[45%] h-[40vh] lg:h-auto relative bg-brand-light flex-shrink-0 group overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/30 pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 lg:top-12 lg:left-12 lg:bottom-auto">
            <div className="bg-brand-accent px-4 py-1.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
              <Zap className="w-3 h-3 text-brand-secondary fill-current" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-secondary">Tuyệt phẩm</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-lg border border-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-green-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-secondary">Đã khử độc</span>
            </div>
          </div>
        </div>

        {/* 2. Content Section - Scrollable with safe area */}
        <div className="w-full lg:w-[55%] flex flex-col h-full bg-white overflow-y-auto no-scrollbar relative">
          <div className="px-6 py-8 lg:p-16 pb-44 lg:pb-52">
            
            {/* Header Info */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-brand-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.2em]">5.0 (Hơn 240 khách hàng hài lòng)</span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-serif font-black text-brand-secondary mb-4 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-4">
                 <span className="text-4xl lg:text-6xl font-black text-brand-primary tracking-tighter">
                   {formatCurrency(product.price)}
                 </span>
                 <div className="flex flex-col mb-1.5">
                   <span className="text-stone-300 line-through text-[11px] font-bold">
                     {formatCurrency(product.price * 1.2)}
                   </span>
                   <span className="text-brand-accent text-[9px] font-black uppercase tracking-widest bg-brand-accent/10 px-2 py-0.5 rounded-md mt-0.5">Tiết kiệm 20%</span>
                 </div>
              </div>
            </div>

            {/* Benefit Chips - Compact for mobile */}
            <div className="grid grid-cols-2 gap-2 mb-8">
               {product.benefits.map((benefit, i) => (
                 <div key={i} className="flex items-center gap-3 p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
                    <div className="w-8 h-8 rounded-xl bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                       <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-secondary uppercase leading-tight line-clamp-2">{benefit}</span>
                 </div>
               ))}
            </div>

            {/* Navigation Tabs */}
            <div className="sticky top-0 bg-white z-20 py-3 flex border-b border-stone-100 mb-8 overflow-x-auto no-scrollbar gap-8">
               {[
                 { id: 'desc', label: 'Mô tả' },
                 { id: 'specs', label: 'Thông số' },
                 { id: 'usage', label: 'Cách dùng' }
               ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-brand-secondary' : 'text-stone-300'}`}
                 >
                   {tab.label}
                   {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-accent rounded-full animate-in zoom-in duration-300" />}
                 </button>
               ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[200px] animate-in fade-in duration-500">
              {activeTab === 'desc' && (
                <div className="space-y-6">
                  <p className="text-stone-500 text-[13px] lg:text-lg leading-relaxed font-medium">
                    {product.description} Sản phẩm được các nghệ nhân Thanh Hà tuyển chọn dược liệu từ vùng núi cao Tây Bắc, ngâm ủ trong chum sành khử độc tố giúp hương vị êm dịu, không gây đau đầu sau khi sử dụng. 
                  </p>
                  <div className="p-5 bg-brand-accent/5 rounded-2xl border border-brand-accent/10 flex items-start gap-4">
                     <Info className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                     <p className="text-[11px] font-bold text-brand-secondary italic">"Cam kết 100% thảo dược tự nhiên, được sơ chế theo phương pháp bí truyền để giữ trọn dược tính quý giá."</p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="flex flex-col border border-stone-100 rounded-[2rem] bg-stone-50/50 overflow-hidden divide-y divide-stone-100">
                   {[
                     { icon: <MapPin className="w-4 h-4" />, label: "Xuất xứ", value: product.origin },
                     { icon: <Ruler className="w-4 h-4" />, label: "Dung tích", value: product.volume },
                     { icon: <Wine className="w-4 h-4" />, label: "Nồng độ", value: product.alcoholContent },
                     { icon: <Calendar className="w-4 h-4" />, label: "Ngâm ủ", value: product.agingTime },
                   ].map((spec, i) => (
                     <div key={i} className="flex items-center justify-between p-5 hover:bg-white transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="text-brand-accent flex-shrink-0 group-hover:scale-110 transition-transform">{spec.icon}</div>
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <span className="text-[11px] font-black text-brand-secondary text-right tabular-nums">{spec.value || 'Tiêu chuẩn'}</span>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="relative p-7 rounded-[2.5rem] border border-brand-accent/20 bg-gradient-to-br from-brand-light to-white overflow-hidden shadow-sm">
                  <Wine className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-accent/10 rotate-12" />

                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between border-b border-brand-accent/10 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-secondary text-brand-accent rounded-2xl shadow-xl">
                          <GlassWater className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-serif font-black uppercase tracking-widest text-brand-secondary">Thưởng thức chuẩn vị</h4>
                      </div>
                      <div className="px-4 py-1.5 bg-brand-accent/10 rounded-full flex items-center gap-2 border border-brand-accent/20">
                        <Timer className="w-3.5 h-3.5 text-brand-accent" />
                        <span className="text-[9px] font-black text-brand-accent uppercase">Mỗi ngày</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { 
                          num: "01", 
                          title: "Liều lượng vàng", 
                          desc: "Dùng từ 1-2 chén nhỏ (khoảng 20-30ml) trong mỗi bữa ăn chính để kích thích tiêu hóa và bồi bổ.",
                          icon: <Beaker className="w-4 h-4" />
                        },
                        { 
                          num: "02", 
                          title: "Ướp lạnh hoàn hảo", 
                          desc: "Rượu sẽ đạt vị êm và thơm nhất khi được làm lạnh ở nhiệt độ 10-15°C trước khi rót ra chén.",
                          icon: <Wine className="w-4 h-4" />
                        },
                        { 
                          num: "03", 
                          title: "Bảo quản đúng cách", 
                          desc: "Đậy kín nắp sau khi sử dụng, để nơi khô ráo, tránh ánh nắng trực tiếp để không làm biến chất.",
                          icon: <ShieldCheck className="w-4 h-4" />
                        }
                      ].map((step, idx, arr) => (
                        <div key={idx} className="flex gap-5 group">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-accent text-brand-secondary flex items-center justify-center text-[11px] font-black shadow-lg group-hover:bg-brand-accent transition-all">
                              {step.num}
                            </div>
                            {idx !== arr.length - 1 && <div className="w-0.5 flex-1 bg-brand-accent/20 my-2" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <h5 className="text-[11px] font-black text-brand-secondary uppercase mb-1.5 flex items-center gap-2">
                              <span className="text-brand-accent">{step.icon}</span>
                              {step.title}
                            </h5>
                            <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-brand-secondary text-white rounded-2xl text-[10px] font-bold text-center italic shadow-2xl">
                      "Hãy thưởng thức có trách nhiệm vì sức khỏe của chính bạn."
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upsell Bundle */}
            <div className="mt-12 p-6 rounded-[2.5rem] bg-brand-light border border-brand-accent/10">
               <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Percent className="w-5 h-5 text-brand-accent" />
                    <div>
                      <h4 className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Gợi ý Combo</h4>
                      <p className="text-[9px] text-stone-400 font-bold">Mua cùng sản phẩm này để nhận thêm ưu đãi</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-brand-accent uppercase bg-brand-accent/10 px-2.5 py-1 rounded-lg">-15% OFF</span>
               </div>
               <div className="space-y-3">
                  {frequentlyBought.map(p => (
                    <div key={p.id} className="bg-white p-3.5 rounded-2xl shadow-sm flex items-center gap-4 border border-transparent hover:border-brand-accent transition-all group cursor-pointer">
                      <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                      <div className="flex-1">
                         <p className="text-[11px] font-black text-brand-secondary line-clamp-1">{p.name}</p>
                         <p className="text-[10px] font-bold text-brand-primary">{formatCurrency(p.price)}</p>
                      </div>
                      <button className="p-3 bg-stone-50 rounded-xl text-brand-secondary hover:bg-brand-accent hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* 3. STICKY ACTION BAR */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-t border-stone-100 px-6 py-5 lg:px-16 lg:py-8 flex flex-col gap-4 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
             <div className="flex items-center justify-between">
                <div className="flex items-center bg-stone-100/80 rounded-2xl p-1 border border-stone-200">
                  <button onClick={() => handleQuantityChange(-1)} className="w-12 h-12 flex items-center justify-center text-brand-secondary active:scale-75 transition-all"><Minus className="w-5 h-5" /></button>
                  <div className="px-5 text-center min-w-[3rem]">
                     <span className="text-xl font-black text-brand-secondary tabular-nums">{quantity}</span>
                  </div>
                  <button onClick={() => handleQuantityChange(1)} className="w-12 h-12 flex items-center justify-center text-brand-secondary active:scale-75 transition-all"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Thành tiền:</span>
                  <span className="text-2xl lg:text-3xl font-black text-brand-primary tracking-tighter">{formatCurrency(product.price * quantity)}</span>
                </div>
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-16 lg:w-20 h-16 lg:h-20 flex items-center justify-center bg-brand-secondary text-white rounded-[1.2rem] hover:bg-brand-primary active:scale-90 transition-all shadow-xl"
                  title="Thêm vào giỏ hàng"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
                
                <button 
                  onClick={() => onBuyNow(product, quantity)}
                  className="flex-1 bg-brand-accent text-brand-secondary h-16 lg:h-20 rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[12px] lg:text-[14px] shadow-2xl shadow-brand-accent/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Đặt mua ngay <ArrowRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductDetailModal;
