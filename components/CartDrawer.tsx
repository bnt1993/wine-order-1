
import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Wallet, CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck, Ticket, CreditCard as CardIcon, Building2, Copy, Check, QrCode, PhoneIncoming } from 'lucide-react';
import { CartItem, Order } from '../types';
import { useOrders } from '../hooks/useOrders';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  totalPrice: number;
  clearCart: () => void;
}

type CheckoutStep = 'cart' | 'info' | 'payment' | 'success';
type PaymentMethod = 'cod' | 'bank' | 'visa';

const CartDrawer: React.FC<Props> = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, totalPrice, clearCart }) => {
  const { createOrder } = useOrders();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderInfo, setOrderInfo] = useState({ name: '', phone: '', address: '', note: '' });
  const [promoCode, setPromoCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  
  const shippingFee = useMemo(() => (totalPrice >= 1500000 ? 0 : 35000), [totalPrice]);
  const finalTotal = useMemo(() => totalPrice + shippingFee, [totalPrice, shippingFee]);

  const bankAccount = {
    id: 'Sacombank',
    no: '046914071993',
    name: 'BUI NGOC TAY'
  };

  const qrUrl = useMemo(() => {
    return `https://img.vietqr.io/image/${bankAccount.id}-${bankAccount.no}-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent('THANH HA ' + orderInfo.phone)}&accountName=${encodeURIComponent(bankAccount.name)}`;
  }, [finalTotal, orderInfo.phone, bankAccount.id, bankAccount.no, bankAccount.name]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 'cart') setStep('info');
    else if (step === 'info') setStep('payment');
    else if (step === 'payment') {
      const orderId = `TH${Math.floor(Math.random()*90000 + 10000)}`;
      const newOrder = {
        id: orderId,
        customer: orderInfo,
        items: cart,
        total_price: finalTotal,
        payment_method: paymentMethod === 'cod' ? 'COD' : paymentMethod === 'bank' ? 'BANK' : 'VISA',
        status: 'pending',
        created_at: new Date().toISOString()
      };


      createOrder(newOrder);
      setLastOrderId(orderId);
      setStep('success');
    }
  };

  const handleBackStep = () => {
    if (step === 'info') setStep('cart');
    else if (step === 'payment') setStep('info');
  };

  const handleClose = () => {
    if (step === 'success') {
      clearCart();
      setStep('cart');
    }
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const steps = [
    { id: 'cart', label: 'Giỏ hàng' },
    { id: 'info', label: 'Địa chỉ' },
    { id: 'payment', label: 'Thanh toán' },
    { id: 'success', label: 'Hoàn tất' }
  ];
  
  const currentIdx = steps.findIndex(s => s.id === step);

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      <div className="absolute inset-0 bg-brand-secondary/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      <div className={`absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="bg-brand-secondary text-white py-4 relative z-20">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {step !== 'cart' && step !== 'success' && (
                <button onClick={handleBackStep} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h2 className="text-sm font-serif font-black uppercase tracking-widest">
                {step === 'success' ? 'Hoàn Tất Đặt Hàng' : 'Thanh Toán Đơn Hàng'}
              </h2>
            </div>
            <button onClick={handleClose} className="p-1.5 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 flex items-center justify-between relative">
            <div className="absolute top-[10px] left-10 right-10 h-[1px] bg-white/10" />
            <div 
              className="absolute top-[10px] left-10 h-[1px] bg-brand-accent transition-all duration-500" 
              style={{ width: `${(currentIdx / (steps.length - 1)) * 75}%` }}
            />
            {steps.map((s, idx) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                  idx <= currentIdx ? 'bg-brand-accent text-brand-secondary' : 'bg-brand-secondary border border-white/20 text-white/30'
                }`}>
                  {idx < currentIdx ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                </div>
                <span className={`text-[7px] font-black uppercase tracking-tighter ${idx <= currentIdx ? 'text-brand-accent' : 'text-white/20'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-stone-50/50 no-scrollbar overflow-x-hidden p-4 space-y-4">
          {step === 'cart' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              {cart.length === 0 ? (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Giỏ hàng đang trống</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm flex gap-3 border border-stone-100">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-bold text-brand-secondary text-[11px] leading-tight line-clamp-1">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-stone-50 rounded-lg p-0.5">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="w-3 h-3" /></button>
                              <span className="px-2 text-[10px] font-black">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="w-3 h-3" /></button>
                            </div>
                            <span className="text-brand-primary font-black text-[11px]">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-100 flex items-center gap-3">
                    <Ticket className="w-4 h-4 text-brand-accent" />
                    <input 
                      type="text" placeholder="MÃ GIẢM GIÁ (NẾU CÓ)" 
                      className="flex-1 bg-transparent text-[9px] font-black outline-none placeholder:text-stone-300"
                      value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <button className="text-[8px] font-black text-brand-secondary bg-brand-accent px-3 py-1.5 rounded-lg uppercase">Áp dụng</button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'info' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <h3 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-accent" /> Thông tin nhận hàng
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Họ và tên khách hàng *" 
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 text-[11px] font-bold outline-none focus:border-brand-accent"
                  value={orderInfo.name} onChange={e => setOrderInfo({...orderInfo, name: e.target.value})}
                />
                <input 
                  type="tel" placeholder="Số điện thoại liên hệ *" 
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 text-[11px] font-bold outline-none focus:border-brand-accent"
                  value={orderInfo.phone} onChange={e => setOrderInfo({...orderInfo, phone: e.target.value})}
                />
                <textarea 
                  placeholder="Địa chỉ nhận hàng chi tiết... *" 
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 text-[11px] font-bold outline-none focus:border-brand-accent min-h-[80px] resize-none"
                  value={orderInfo.address} onChange={e => setOrderInfo({...orderInfo, address: e.target.value})}
                />
              </div>
              <div className="p-3 bg-brand-accent/5 rounded-xl flex items-center gap-3 border border-brand-accent/10">
                <ShieldCheck className="w-5 h-5 text-brand-accent" />
                <p className="text-[9px] text-brand-secondary font-bold leading-tight">Thông tin cá nhân được bảo mật theo tiêu chuẩn an toàn của Thanh Hà.</p>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
               <h3 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-accent" /> Phương thức thanh toán
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'cod', label: 'Tiền mặt/COD', sub: 'Tại nhà', icon: <Truck className="w-4 h-4" /> },
                  { id: 'bank', label: 'Chuyển khoản', sub: 'Quét QR', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'visa', label: 'Thẻ Quốc tế', sub: 'An toàn', icon: <CardIcon className="w-4 h-4" /> },
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${paymentMethod === m.id ? 'border-brand-accent bg-brand-accent/10' : 'border-stone-100 bg-white'}`}
                  >
                    <div className={paymentMethod === m.id ? 'text-brand-secondary' : 'text-stone-300'}>{m.icon}</div>
                    <span className="font-black text-[9px] text-brand-secondary uppercase text-center">{m.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'bank' && (
                <div className="bg-brand-secondary rounded-2xl p-5 text-white animate-in zoom-in-95 duration-300 shadow-xl overflow-hidden relative">
                   <div className="absolute -top-4 -right-4 opacity-5 rotate-12"><Building2 className="w-24 h-24" /></div>
                   <div className="relative z-10 flex flex-col items-center text-center">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-accent mb-4">Quét mã VietQR để thanh toán</p>
                      <div className="bg-white p-2.5 rounded-xl mb-5 shadow-2xl">
                         <img src={qrUrl} alt="VietQR" className="w-36 h-36" />
                      </div>
                      <div className="w-full space-y-1 text-[9px] font-black uppercase tracking-wider">
                         <div className="flex justify-between border-b border-white/5 pb-1"><span className="opacity-40 text-[7px]">Số tài khoản:</span><div className="flex gap-2 items-center text-brand-accent cursor-pointer" onClick={() => copyToClipboard(bankAccount.no)}>{bankAccount.no} {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-30" />}</div></div>
                         <div className="flex justify-between border-b border-white/5 pb-1"><span className="opacity-40 text-[7px]">Chủ tài khoản:</span><span>{bankAccount.name}</span></div>
                         <div className="flex justify-between"><span className="opacity-40 text-[7px]">Số tiền:</span><span className="text-brand-accent">{formatCurrency(finalTotal)}</span></div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-100 mb-8 -rotate-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif font-black text-brand-secondary mb-2">Đã Tiếp Nhận!</h2>
              <p className="text-[11px] text-gray-400 font-medium mb-8 italic">Mã đơn hàng: <span className="text-brand-primary font-black">#{lastOrderId}</span></p>
              
              <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 mb-10 w-full flex items-center gap-5 shadow-sm">
                 <div className="w-14 h-14 bg-brand-soft text-brand-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-brand-accent/10">
                    <PhoneIncoming className="w-7 h-7" />
                 </div>
                 <div className="text-left flex-1">
                    <p className="text-[11px] font-bold text-brand-secondary leading-tight mb-1">
                      Cảm ơn quý khách! Đội ngũ Thanh Hà sẽ sớm liên hệ tới số:
                    </p>
                    <p className="text-xl font-black text-brand-primary tracking-widest leading-none">
                      {orderInfo.phone || 'Chưa cung cấp'}
                    </p>
                    <p className="text-[9px] text-stone-400 mt-2 font-black uppercase tracking-tighter">
                      Để xác nhận đơn hàng và chuẩn bị gửi hàng.
                    </p>
                 </div>
              </div>

              <div className="w-full">
                <button 
                  onClick={handleClose} 
                  className="w-full bg-brand-secondary text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform shadow-xl"
                >
                  Quay lại trang chủ
                </button>
              </div>
            </div>
          )}
        </div>

        {step !== 'success' && cart.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] relative z-30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Giao hàng: <span className={shippingFee === 0 ? 'text-green-600' : ''}>{shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}</span></span>
                <span className="text-[8px] font-black text-brand-secondary uppercase">Tổng thanh toán:</span>
              </div>
              <span className="text-xl font-serif font-black text-brand-primary tracking-tighter">
                {formatCurrency(finalTotal)}
              </span>
            </div>

            <button 
              disabled={(step === 'info' && (!orderInfo.name || !orderInfo.phone || !orderInfo.address))}
              onClick={handleNextStep}
              className="w-full bg-brand-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-20"
            >
              {step === 'cart' ? 'Tiếp tục đặt hàng' : step === 'info' ? 'Đi tới thanh toán' : 'Xác nhận đặt ngay'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
