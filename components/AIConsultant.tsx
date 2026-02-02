import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { ChatMessage } from "../types";

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(""); // typing effect

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Smooth scroll */
  const smartScroll = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(smartScroll, [messages, loading, aiTyping]);

  /* Typing Effect */
  const typingEffect = async (text: string, callback: () => void) => {
    setAiTyping("");
    let i = 0;

    const speed = 18; // tốc độ gõ

    const typer = setInterval(() => {
      setAiTyping((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(typer);
        callback();
      }
    }, speed);
  };

  /* Handle form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    // Focus input lại
    setTimeout(() => inputRef.current?.focus(), 200);

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: userText }],
    };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: [...messages, userMessage], // lịch sử chuẩn
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Xin lỗi, tôi chưa thể trả lời lúc này.";

      // Hiệu ứng gõ của AI
      await typingEffect(reply, () => {
        const doneMsg: ChatMessage = {
          role: "model",
          parts: [{ text: reply }],
        };

        setMessages((prev) => [...prev, doneMsg]);
        setAiTyping(""); // reset
      });
    } catch (err) {
      const errorMsg: ChatMessage = {
        role: "model",
        parts: [{ text: "Lỗi kết nối server. Vui lòng thử lại." }],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consult" className="py-16 sm:py-24 bg-brand-light">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Trợ Lý Thông Minh
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-brand-secondary mb-4">
            Tư Vấn Sức Khỏe AI
          </h2>

          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Chia sẻ tình trạng sức khỏe của bạn, AI của Thanh Hà sẽ đề xuất loại dược tửu phù hợp.
          </p>
        </div>

        {/* CHAT BOX */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-brand-primary/5 overflow-hidden flex flex-col h-[600px]">

          {/* HEADER CHAT */}
          <div className="bg-brand-secondary p-5 flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center shadow-lg rotate-3">
              <Bot className="text-brand-secondary w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-black leading-none mb-1">
                Thanh Hà Consultant
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-brand-accent text-[9px] font-black uppercase tracking-widest">
                  Sẵn sàng tư vấn
                </p>
              </div>
            </div>
          </div>

          {/* CHAT BODY */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50 no-scrollbar"
          >
            {/* Empty state */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
                <Bot className="w-12 h-12 opacity-20" />
                <p className="text-xs uppercase tracking-widest font-bold text-brand-secondary/50">
                  Hãy bắt đầu cuộc trò chuyện...
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all ${
                    msg.role === "user"
                      ? "bg-brand-secondary text-white rounded-tr-none"
                      : "bg-white border border-stone-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.parts[0].text}
                  </p>
                </div>
              </div>
            ))}

            {/* AI Typing Effect */}
            {aiTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 animate-fade-in">
                  {aiTyping}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && !aiTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-stone-200">
            <div className="flex gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về sức khỏe của bạn..."
                className="flex-1 bg-transparent px-4 py-3 text-sm font-semibold focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-brand-secondary text-white p-3 rounded-xl hover:bg-brand-primary active:scale-95 transition-all disabled:opacity-30"
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
