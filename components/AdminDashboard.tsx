
import React, { useState, useMemo } from 'react';
import { 
  X, Search, Filter, Package, User, MapPin, CreditCard, Clock, 
  CheckCircle, AlertCircle, Trash2, ExternalLink, Calendar, 
  LayoutDashboard, ShoppingCart, Users, Box, Plus, Pencil, 
  BarChart3, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight,
  Phone, Lock, ShieldAlert, KeyRound, ChevronRight
} from 'lucide-react';
import { Order, OrderStatus, Product, Category } from '../types';

type Tab = 'stats' | 'orders' | 'products' | 'customers';

const AdminDashboard: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}> = ({ 
  isOpen, onClose, orders, updateStatus, deleteOrder, products, setProducts 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const ADMIN_PASSWORD = 'thanhha2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword('');
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLoginError(false);
    onClose();
  };

  const stats = useMemo(() => {
    const totalRev = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalCustomers = new Set(orders.map(o => o.customer.phone)).size;
    return { totalRev, pendingOrders, totalCustomers };
  }, [orders]);

  const customers = useMemo(() => {
    const unique = new Map();
    orders.forEach(o => {
      if (!unique.has(o.customer.phone)) {
        unique.set(o.customer.phone, {
          ...o.customer,
          totalSpent: o.totalPrice,
          orderCount: 1,
          lastOrder: o.created_at
        });
      } else {
        const existing = unique.get(o.customer.phone);
        unique.set(o.customer.phone, {
          ...existing,
          totalSpent: existing.totalSpent + o.totalPrice,
          orderCount: existing.orderCount + 1,
          lastOrder: o.createdAt > existing.lastOrder ? o.createdAt : existing.lastOrder
        });
      }
    });
    return Array.from(unique.values());
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.customer.phone.includes(searchQuery) ||
                         o.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-brand-secondary/98 backdrop-blur-xl animate-in fade-in duration-500" />
        <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10 text-center">
          <button onClick={handleClose} className="absolute top-6 right-6 text-stone-300 hover:text-brand-secondary">
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 bg-brand-soft rounded-3xl flex items-center justify-center text-brand-accent mx-auto mb-8 shadow-inner border border-brand-accent/10">
            <ShieldAlert className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-serif font-black text-brand-secondary mb-2 uppercase tracking-tight">Khu Vực Nội Bộ</h2>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-8">Vui lòng nhập mật khẩu quản trị</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                autoFocus
                type="password" 
                placeholder="Mật khẩu hệ thống"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-5 py-4 rounded-xl bg-stone-50 border text-xs font-bold outline-none transition-all ${loginError ? 'border-red-500 focus:border-red-500' : 'border-stone-100 focus:border-brand-accent'}`}
              />
            </div>
            {loginError && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Mật khẩu không chính xác</p>}
            
            <button 
              type="submit"
              className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all mt-4"
            >
              Xác thực quyền <ChevronRight className="w-4 h-4" />
            </button>
          </form>
          
          <p className="mt-10 text-[8px] font-black text-stone-300 uppercase tracking-[0.3em]">© 2024 Thanh Ha Security System</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 overflow-hidden">
      <div className="absolute inset-0 bg-brand-secondary/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={handleClose} />
      
      <div className="relative w-full max-w-7xl h-full sm:h-[95vh] bg-stone-50 rounded-none sm:rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border border-white/10">
        
        <aside className="w-full sm:w-72 bg-white border-r border-stone-100 flex flex-col h-auto sm:h-full">
          <div className="p-8 border-b border-stone-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 rotate-3">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black text-brand-secondary tracking-tighter">THANH HÀ</h1>
              <p className="text-[8px] font-black text-brand-accent uppercase tracking-widest">Admin Control Panel</p>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
            {[
              { id: 'stats', label: 'Tổng quan', icon: BarChart3 },
              { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
              { id: 'products', label: 'Sản phẩm', icon: Box },
              { id: 'customers', label: 'Khách hàng', icon: Users },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id as Tab); setSearchQuery(''); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${
                  activeTab === t.id 
                  ? 'bg-brand-secondary text-white shadow-xl shadow-brand-secondary/20 translate-x-1' 
                  : 'text-stone-400 hover:bg-stone-50 hover:text-brand-secondary'
                }`}
              >
                <t.icon className={`w-5 h-5 ${activeTab === t.id ? 'text-brand-accent' : ''}`} />
                {t.label}
                {t.id === 'orders' && stats.pendingOrders > 0 && (
                  <span className="ml-auto bg-brand-accent text-brand-secondary w-5 h-5 rounded-lg flex items-center justify-center text-[9px]">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-stone-50">
            <button onClick={handleClose} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-stone-400 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
              <X className="w-5 h-5" /> Thoát hệ thống
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-full min-w-0">
          <header className="h-20 bg-white border-b border-stone-100 px-8 flex items-center justify-between flex-shrink-0">
            <h2 className="text-sm font-black text-brand-secondary uppercase tracking-[0.2em]">
              {activeTab === 'stats' && 'Thống kê tổng quan'}
              {activeTab === 'orders' && 'Quản lý vận đơn'}
              {activeTab === 'products' && 'Kho sản phẩm'}
              {activeTab === 'customers' && 'Hồ sơ khách hàng'}
            </h2>

            <div className="relative w-64 lg:w-96 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                type="text" 
                placeholder="Tìm kiếm thông tin..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 sm:p-10 no-scrollbar bg-stone-50/50">
            {activeTab === 'stats' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Doanh thu (Xác nhận)', value: formatCurrency(stats.totalRev), icon: DollarSign, trend: '+12%', up: true },
                    { label: 'Khách hàng thân thiết', value: stats.totalCustomers, icon: Users, trend: '+5%', up: true },
                    { label: 'Đơn chờ duyệt', value: stats.pendingOrders, icon: Clock, trend: '-2%', up: false },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm group hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-stone-50 rounded-2xl text-brand-accent group-hover:scale-110 transition-transform">
                          <s.icon className="w-6 h-6" />
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${s.up ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                          {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {s.trend}
                        </div>
                      </div>
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{s.label}</h4>
                      <p className="text-3xl font-black text-brand-secondary tracking-tighter">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
                  {['all', 'pending', 'processing', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOrderFilter(s as any)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                        orderFilter === s ? 'bg-brand-secondary text-white border-brand-secondary shadow-lg' : 'bg-white text-stone-400 border-stone-100'
                      }`}
                    >
                      {s === 'all' ? 'Tất cả' : s === 'pending' ? 'Chờ duyệt' : s === 'processing' ? 'Đang giao' : s === 'completed' ? 'Xong' : 'Hủy'}
                    </button>
                  ))}
                </div>
                
                <div className="grid gap-4">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex flex-col lg:flex-row items-center gap-6 group">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-black text-brand-primary">#{order.id}</span>
                          <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                            order.status === 'completed' ? 'bg-green-50 text-green-600' : 
                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {order.status}
                          </div>
                          <span className="text-stone-300 text-[10px] font-bold ml-auto">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Khách hàng</p>
                            <p className="text-xs font-black text-brand-secondary">{order.customer.name}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                            <p className="text-xs font-black text-brand-secondary">{order.customer.phone}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Tổng tiền</p>
                            <p className="text-xs font-black text-brand-primary">{formatCurrency(order.totalPrice)}</p>
                          </div>
                          <div className="flex gap-2">
                             <a href={`tel:${order.customer.phone}`} className="p-2.5 bg-stone-50 rounded-xl text-brand-secondary hover:bg-brand-accent hover:text-white transition-all">
                                <Phone className="w-4 h-4" />
                             </a>
                             <button onClick={() => deleteOrder(order.id)} className="p-2.5 text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                   <div className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
                     Hiển thị {filteredProducts.length} sản phẩm
                   </div>
                   <button 
                    onClick={() => setShowAddProduct(true)}
                    className="flex items-center gap-2 bg-brand-secondary text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
                   >
                     <Plus className="w-4 h-4" /> Thêm mới
                   </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Sản phẩm</th>
                        <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Danh mục</th>
                        <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Giá</th>
                        <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                              <span className="text-xs font-black text-brand-secondary">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-stone-100 rounded-lg text-[9px] font-black text-stone-500 uppercase">{product.category}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs font-black text-brand-primary">{formatCurrency(product.price)}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => deleteProduct(product.id)} className="p-2 text-stone-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="flex items-center gap-5 mb-8">
                          <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-brand-accent group-hover:bg-brand-secondary group-hover:text-white transition-all">
                             <User className="w-8 h-8" />
                          </div>
                          <div>
                             <h4 className="text-sm font-serif font-black text-brand-secondary mb-1">{customer.name}</h4>
                             <p className="text-[10px] font-bold text-stone-400">{customer.phone}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-3 mb-8">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                             <span>Tổng chi tiêu:</span>
                             <span className="text-brand-primary">{formatCurrency(customer.totalSpent)}</span>
                          </div>
                       </div>

                       <div className="flex gap-2">
                          <a href={`tel:${customer.phone}`} className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-lg active:scale-95">
                             <Phone className="w-5 h-5" /> Gọi điện xác nhận
                          </a>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
