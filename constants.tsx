
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Rượu Đinh Lăng Điêu Khắc',
    category: Category.DượcLiệuQuý,
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    description: 'Rễ đinh lăng lâu năm được điêu khắc hình rồng phượng tinh xảo, ngâm cùng rượu nếp cái hoa vàng chuẩn vị.',
    benefits: ['Bồi bổ cơ thể', 'Tăng cường trí nhớ', 'Giảm đau xương khớp'],
    badges: ['Tuyệt Tác', 'Bán Chạy'],
    origin: 'Nam Định, Việt Nam',
    volume: '5 Lít',
    alcoholContent: '35%',
    agingTime: '18 tháng'
  },
  {
    id: '2',
    name: 'Rượu Ba Kích Tím Quảng Ninh',
    category: Category.HỗTrợSứcKhỏe,
    price: 450000,
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800',
    description: 'Ba kích tím xịn rừng Quảng Ninh, giúp tăng cường sinh lực và mạnh gân cốt.',
    benefits: ['Bổ thận tráng dương', 'Hỗ trợ sinh lý', 'Giảm nhức mỏi'],
    badges: ['Bán Chạy', 'Ưu Đãi Có Hạn'],
    origin: 'Tiên Yên, Quảng Ninh',
    volume: '2 Lít',
    alcoholContent: '38%',
    agingTime: '12 tháng'
  },
  {
    id: '3',
    name: 'Rượu Đông Trùng Hạ Thảo',
    category: Category.SâmVàNấm,
    price: 2200000,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800',
    description: 'Sử dụng Đông trùng hạ thảo nuôi cấy chuẩn VietGAP, kết hợp rượu lọc độc tố tinh khiết.',
    benefits: ['Tăng cường hệ miễn dịch', 'Chống lão hóa', 'Bảo vệ phổi và thận'],
    badges: ['Thượng Hạng', 'Mới'],
    origin: 'Lâm Đồng, Việt Nam',
    volume: '1 Lít',
    alcoholContent: '32%',
    agingTime: '6 tháng'
  },
  {
    id: '4',
    name: 'Rượu Sâm Cau Đỏ Rừng',
    category: Category.HỗTrợSứcKhỏe,
    price: 380000,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    description: 'Sâm cau đỏ rừng tự nhiên, vị cay nồng đặc trưng, mang lại sức mạnh từ núi rừng.',
    benefits: ['Tăng cường bản lĩnh phái mạnh', 'Giảm mệt mỏi', 'Kích thích tiêu hóa'],
    badges: ['Nổi Bật'],
    origin: 'Tây Bắc, Việt Nam',
    volume: '2 Lít',
    alcoholContent: '40%',
    agingTime: '12 tháng'
  },
  {
    id: '5',
    name: 'Rượu Sim Rừng Phú Quốc',
    category: Category.TráiCâyRừng,
    price: 250000,
    image: 'https://images.unsplash.com/photo-1528823331199-6996456428c3?auto=format&fit=crop&q=80&w=800',
    description: 'Trái sim rừng chín mọng, lên men tự nhiên tạo nên hương vị ngọt ngào, êm dịu.',
    benefits: ['Tốt cho hệ tiêu hóa', 'Giàu vitamin', 'Dễ uống cho cả nam và nữ'],
    badges: ['Dễ Uống'],
    origin: 'Phú Quốc, Việt Nam',
    volume: '750ml',
    alcoholContent: '15%',
    agingTime: '3 tháng'
  },
  {
    id: '6',
    name: 'Rượu Táo Mèo Yên Bái',
    category: Category.TráiCâyRừng,
    price: 180000,
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&q=80&w=800',
    description: 'Táo mèo chọn lọc từ vùng núi Yên Bái, ngâm ủ kỹ lưỡng mang lại vị chua chát nhẹ nhàng.',
    benefits: ['Hỗ trợ hạ huyết áp', 'Giúp ăn ngon ngủ sâu', 'Giảm mỡ máu'],
    badges: ['Phổ Biến', 'Ưu Đãi Có Hạn'],
    origin: 'Mù Cang Chải, Yên Bái',
    volume: '2 Lít',
    alcoholContent: '29%',
    agingTime: '9 tháng'
  }
];
