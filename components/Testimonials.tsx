
import React from 'react';
import { Star, Quote, CheckCircle2, Award, Newspaper, ShieldCheck } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Nguyễn Văn Hùng',
    location: 'Hà Nội',
    content: 'Bình rượu Đinh Lăng điêu khắc rồng phượng thực sự là một tác phẩm nghệ thuật. Tôi trưng bày ở phòng khách ai cũng trầm trồ. Vị rượu êm, không bị nồng gắt.',
    rating: 5,
    avatar: 'H',
    date: '15/10/2023'
  },
  {
    id: 2,
    name: 'Trần Thị Mai',
    location: 'TP. Hồ Chí Minh',
    content: 'Tôi mua rượu Sim biếu bố mẹ, các cụ rất thích vì dễ uống và tốt cho tiêu hóa. Đóng gói 5 lớp cực kỳ chắc chắn, vận chuyển vào Nam mà không sứt mẻ gì.',
    rating: 5,
    avatar: 'M',
    date: '02/11/2023'
  },
  {
    id: 3,
    name: 'Lê Minh Đức',
    location: 'Quảng Ninh',
    content: 'Tư vấn AI rất thông minh, giúp tôi chọn được loại rượu Ba Kích chuẩn vị rừng. Thanh Hà làm việc rất chuyên nghiệp, sẽ còn ủng hộ lâu dài.',
    rating: 5,
    avatar: 'Đ',
    date: '20/12/2023'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-[#faf9f6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Press / Trust Section */}
        <div className="mb-24">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-brand-accent/30"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Sự bảo chứng từ truyền thông</span>
              <div className="h-px w-8 bg-brand-accent/30"></div>
            </div>
            <h3 className="text-2xl font-serif font-black text-brand-secondary uppercase">Báo chí nói về Thanh Hà</h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
             <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                <span className="font-serif font-black text-xl italic tracking-tighter">VNExpress</span>
             </div>
             <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span className="font-serif font-black text-2xl tracking-tighter">VTV1</span>
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-serif font-black text-xl tracking-tighter">Sức Khỏe Đời Sống</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase tracking-widest border border-brand-secondary px-2 py-0.5">Tiêu chuẩn OCOP</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-center mb-12 sm:mb-20 text-center">
          <Quote className="w-8 h-8 sm:w-12 sm:h-12 text-brand-accent/20 mb-4" />
          <h2 className="text-3xl sm:text-6xl font-serif font-black text-brand-secondary mb-4">
            Khách Hàng <span className="text-brand-accent">Nói Gì?</span>
          </h2>
          <div className="w-20 h-1 bg-brand-accent rounded-full mb-6"></div>
          <p className="text-gray-500 text-xs sm:text-base max-w-xl font-medium uppercase tracking-widest">
            Hành trình 20 năm gìn giữ tinh hoa dược tửu
          </p>
        </div>

        <div className="flex overflow-x-auto pb-10 gap-6 sm:gap-8 no-scrollbar snap-x px-4">
          {REVIEWS.map((review) => (
            <div 
              key={review.id} 
              className="min-w-[300px] sm:min-w-[450px] bg-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_30px_60px_rgba(107,45,21,0.03)] border border-stone-100 snap-center flex flex-col hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                ))}
              </div>
              
              <p className="text-brand-secondary italic text-base sm:text-xl leading-relaxed mb-10 flex-1 font-medium">
                "{review.content}"
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-stone-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-secondary text-brand-accent rounded-2xl flex items-center justify-center font-black text-xl shadow-lg rotate-3">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-[12px] sm:text-sm font-black text-brand-secondary uppercase tracking-wider">{review.name}</h4>
                    <p className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">{review.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-green-600 uppercase tracking-tighter bg-green-50 px-2.5 py-1.5 rounded-full mb-1">
                     <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
