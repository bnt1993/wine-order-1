
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getHealthConsultation } from '../services/gemini';
import { ChatMessage } from '../types';

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: userText }] };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    const response = await getHealthConsultation(userText, messages);
    setLoading(false);

    const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response || "" }] };
    setMessages(prev => [...prev, modelMessage]);
  };

  return (
    <section id="consult" className="py-16 sm:py-24 bg-brand-light">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Trợ Lý Thông Minh</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-brand-secondary mb-4">Tư Vấn Sức Khỏe AI</h2>
          <p className="text-gray-500 text-xs sm:text-base max-w-2xl mx-auto font-medium">
            Chia sẻ tình trạng sức khỏe của bạn, chuyên gia AI của Thanh Hà sẽ gợi ý loại dược tửu phù hợp nhất.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-brand-primary/5 overflow-hidden flex flex-col h-[500px] sm:h-[650px]">
          {/* Chat Header */}
          <div className="bg-brand-secondary p-4 sm:p-5 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-accent rounded-2xl flex items-center justify-center shadow-lg rotate-3">
              <Bot className="text-brand-secondary w-6 h-6" />
            </div>
            <div>
              <p className="text-white text-sm sm:text-base font-black leading-none mb-1">Thanh Hà Consultant</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-brand-accent text-[9px] font-black uppercase tracking-widest">Sẵn sàng tư vấn</p>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-stone-50/50 no-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-6 animate-in fade-in duration-700">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-stone-100">
                   <Bot className="w-10 h-10 opacity-20 mb-3 mx-auto" />
                   <p className="text-xs font-bold text-brand-secondary/40 max-w-[200px] mx-auto uppercase tracking-tighter">Chào bạn! Hãy hỏi tôi về các loại rượu dược liệu.</p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[280px]">
                  {["Đau lưng mỏi gối", "Rượu bổ thận xịn", "Giúp ngủ ngon hơn"].map(q => (
                    <button 
                      key={q}
                      onClick={() => setInput(q)} 
                      className="text-[10px] font-black uppercase tracking-widest border border-stone-200 bg-white rounded-xl px-4 py-3 hover:bg-brand-accent hover:text-brand-secondary transition-all active:scale-95 shadow-sm"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[90%] sm:max-w-[80%] p-4 sm:p-5 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-secondary text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-stone-100 rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-2 opacity-40">
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-brand-accent" />}
                    <span className="text-[8px] font-black uppercase tracking-widest">{msg.role === 'user' ? 'Bạn' : 'Thanh Hà AI'}</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.parts[0].text}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 rounded-tl-none flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-white border-t border-stone-100">
            <div className="flex gap-2 bg-stone-50 p-1.5 rounded-2xl border border-stone-200 focus-within:border-brand-accent transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về sức khỏe của bạn..."
                className="flex-1 bg-transparent px-4 py-3 text-sm font-bold focus:outline-none placeholder:text-stone-300"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-brand-secondary text-white p-3 rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20 active:scale-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
