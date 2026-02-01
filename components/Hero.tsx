
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Clock, ShieldCheck, Timer, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
    <section id="home" className="relative min-h-[100vh] flex items-center overflow-hidden bg-brand-light">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=2070" 
            alt="Rượu ngâm Thanh Hà" 
            className="w-full h-[120%] object-cover opacity-[0.12] scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/95 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-light"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 sm:pt-40 pb-20">
        <div className="max-w-5xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-soft border border-brand-accent/20 rounded-full mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Star className="w-3.5 h-3.5 text-brand-accent fill-current" />
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">Tinh hoa dược tửu - Giao thoa di sản</span>
          </div>

          {/* Elegant Heading */}
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-serif text-brand-secondary mb-10 leading-[0.9] animate-in fade-in slide-in-from-left duration-1000 delay-100">
            <span className="block font-light italic text-brand-accent mb-1 sm:mb-2">Trân quý</span>
            <span className="block font-black tracking-tighter uppercase">Tinh Hoa</span>
            <span className="block font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Thanh Hà</span>
          </h1>
          
          {/* Subtext */}
          <div className="flex items-start gap-6 mb-16 animate-in fade-in slide-in-from-left duration-1000 delay-200">
            <div className="w-16 h-px bg-brand-accent mt-4 hidden sm:block" />
            <p className="text-stone-400 text-base sm:text-xl lg:text-2xl max-w-2xl leading-relaxed font-medium italic">
              "Gìn giữ hồn cốt thảo dược Việt qua từng giọt rượu được ngâm ủ thủ công, bồi bổ sức khỏe và nâng tầm phong cách sống."
            </p>
          </div>

          {/* Action Group */}
          <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button 
              onClick={() => scrollToSection('products')}
              className="relative overflow-hidden group bg-brand-primary text-white px-10 py-6 sm:px-16 sm:py-7.5 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase tracking-[0.25em] text-[11px] sm:text-[13px] transition-all hover:shadow-2xl hover:shadow-brand-primary/30 active:scale-95 flex items-center justify-center gap-4"
            >
              <span className="relative z-10">Khám phá sản phẩm</span>
              <ArrowRight className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
            
            <button 
              onClick={() => scrollToSection('consult')}
              className="px-10 py-6 sm:px-16 sm:py-7.5 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase tracking-[0.25em] text-[11px] sm:text-[13px] text-brand-secondary border-2 border-brand-accent/30 bg-white/50 backdrop-blur-sm hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all flex items-center justify-center gap-4 group shadow-lg shadow-black/[0.02]"
            >
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-accent group-hover:text-white group-hover:rotate-12 transition-all" />
              Tư vấn chuyên gia
            </button>
          </div>
        </div>
      </div>

      {/* Floating Offer Card (Desktop Only) */}
      <div className="hidden xl:block absolute right-24 top-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in duration-1000 delay-700">
        <div className="bg-white/80 backdrop-blur-3xl border border-brand-accent/10 p-8 rounded-[3rem] shadow-sm max-w-[300px] relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center text-brand-accent border border-brand-accent/10 shadow-sm">
                  <Timer className="w-7 h-7" />
                </div>
                <div>
                   <h4 className="text-brand-secondary font-black uppercase text-[10px] tracking-widest mb-1">Phiên bản hữu hạn</h4>
                   <p className="text-brand-accent text-sm font-serif italic">Đinh lăng 15 năm</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-brand-soft rounded-2xl p-4 border border-brand-accent/5">
                <div className="flex flex-col">
                   <div className="flex gap-2">
                      <span className="text-brand-primary font-black text-lg tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="text-brand-accent font-black text-lg">:</span>
                      <span className="text-brand-primary font-black text-lg tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="text-brand-accent font-black text-lg">:</span>
                      <span className="text-brand-primary font-black text-lg tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                   </div>
                </div>
                <button className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white hover:rotate-90 transition-transform active:scale-90 shadow-xl shadow-brand-primary/20">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-20">
        <ChevronDown className="w-5 h-5 text-brand-accent" />
      </div>
    </section>
  );
};

export default Hero;
