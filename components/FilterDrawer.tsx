
import React from 'react';
import { X, RotateCcw, Filter, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  categories: string[];
  priceRanges: { label: string; min: number; max: number }[];
  resetFilters: () => void;
  totalResults: number;
}

const FilterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  categories,
  priceRanges,
  resetFilters,
  totalResults
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">
      <div className="absolute inset-0 bg-brand-secondary/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="absolute left-0 top-0 h-full w-full max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-brand-secondary text-white">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-brand-accent" />
            <h2 className="text-lg font-serif font-black uppercase tracking-widest">Bộ Lọc</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
          {/* Category Section */}
          <section>
            <h3 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-4 border-l-4 border-brand-accent pl-3">Danh mục</h3>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-brand-accent text-brand-secondary shadow-lg' 
                      : 'bg-stone-50 text-gray-400 border border-stone-100'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range Section */}
          <section>
            <h3 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-4 border-l-4 border-brand-accent pl-3">Khoảng giá</h3>
            <div className="grid grid-cols-1 gap-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => setPriceRange(range.label)}
                  className={`px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left ${
                    priceRange === range.label 
                      ? 'bg-brand-secondary text-white shadow-lg' 
                      : 'bg-stone-50 text-gray-400 border border-stone-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </section>

          {/* Stats */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <p className="text-[10px] font-bold text-gray-500 text-center">
              Đang hiển thị <span className="text-brand-secondary font-black">{totalResults}</span> sản phẩm phù hợp
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-stone-100 flex gap-3 bg-stone-50/50">
          <button
            onClick={resetFilters}
            className="flex-1 py-4 border-2 border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 hover:bg-white transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Làm mới
          </button>
          <button
            onClick={onClose}
            className="flex-[2] py-4 bg-brand-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
