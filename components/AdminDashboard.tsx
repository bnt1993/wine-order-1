import React, { useMemo, useState } from 'react';
import {
  X, Search, ShoppingCart, Users, Box, BarChart3, Phone, Trash2,
  ChevronRight, KeyRound, ShieldAlert, LayoutDashboard, DollarSign,
  Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';

// ===================== Helpers & UI bits ===================== //

const STATUS_META: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  pending:     { label: 'Chờ duyệt', bg: 'bg-yellow-50', fg: 'text-yellow-700' },
  processing:  { label: 'Đang giao', bg: 'bg-blue-50',   fg: 'text-blue-700'   },
  completed:   { label: 'Hoàn tất',  bg: 'bg-green-50',  fg: 'text-green-700'  },
  cancelled:   { label: 'Đã hủy',    bg: 'bg-red-50',    fg: 'text-red-700'    },
};

const PAYMENT_LABEL: Record<string, string> = {
  cod:  'Thanh toán khi nhận (COD)',
  bank: 'Chuyển khoản',
  momo: 'Ví Momo',
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${m.bg} ${m.fg}`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
};

const StatusSelector: React.FC<{
  value: OrderStatus;
  onChange: (s: OrderStatus) => void | Promise<void>;
  busy?: boolean;
}> = ({ value, onChange, busy }) => {
  const options: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1 bg-stone-50 rounded-xl border border-stone-100">
      {options.map((opt) => {
        const active = value === opt;
        const base = "whitespace-nowrap px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest";
        const cls = active
          ? "bg-brand-secondary text-white shadow"
          : "bg-white text-stone-500 border border-stone-100";
        return (
          <button
            key={opt}
            disabled={busy}
            onClick={() => onChange(opt)}
            className={`${base} ${cls} disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition`}
          >
            {STATUS_META[opt].label}
          </button>
        );
      })}
    </div>
  );
};

const OrderSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-28 bg-stone-100 rounded" />
      <div className="h-6 w-20 bg-stone-100 rounded" />
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-20 bg-stone-100 rounded" />
          <div className="h-4 w-32 bg-stone-100 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const Info: React.FC<{ label: string; value: React.ReactNode; emphasize?: boolean; tel?: boolean }> = ({ label, value, emphasize, tel }) => (
  <div>
    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{label}</p>
    {tel ? (
      <a href={`tel:${value || ''}`} className={`text-xs font-black ${emphasize ? 'text-brand-primary' : 'text-brand-secondary'} underline-offset-2 hover:underline`}>
        {value}
      </a>
    ) : (
      <p className={`text-xs font-black break-words ${emphasize ? 'text-brand-primary' : 'text-brand-secondary'}`}>{value}</p>
    )}
  </div>
);

// ===== Export Utils =====
type RowPrimitive = string | number | null | undefined;

const csvEscape = (v: RowPrimitive) => {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const makeOrderRows = (orders: Order[]) => {
  const headers = [
    'Mã đơn', 'Ngày tạo', 'Trạng thái', 'PT thanh toán',
    'Khách hàng', 'SĐT', 'Địa chỉ',
    'Số SP', 'Chi tiết SP', 'Tổng tiền (VND)',
  ];

  const rows = orders.map(o => {
    const items = o.items || [];
    const itemsCount = items.reduce((n, it) => n + (it.quantity ?? 0), 0);
    const itemsDetail = items.map(it => `${it.name} x${it.quantity}`).join(' | ');
    const created = new Date(o.created_at).toLocaleString('vi-VN', { hour12: false });

    return [
      o.id,
      created,
      STATUS_META[o.status]?.label ?? o.status,
      PAYMENT_LABEL[o.payment_method?.toLowerCase?.() || ''] || o.payment_method || '',
      o.customer?.name || '',
      o.customer?.phone || '',
      o.customer?.address || '',
      itemsCount,
      itemsDetail,
      o.total_price ?? 0,
    ] as RowPrimitive[];
  });

  return { headers, rows };
};

const downloadBlob = (blob: Blob, filename: string) => {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const exportOrdersToCSV = (orders: Order[]) => {
  const { headers, rows } = makeOrderRows(orders);
  const csv = [headers.map(csvEscape).join(','), ...rows.map(r => r.map(csvEscape).join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const ts = new Date().toISOString().slice(0,10);
  downloadBlob(blob, `orders_${ts}.csv`);
};

export const exportOrdersToXLSX = async (orders: Order[]) => {
  const XLSX = await import('xlsx'); // dynamic import để giảm bundle ban đầu
  const { headers, rows } = makeOrderRows(orders);
  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const colWidths = headers.map((h, i) => ({
    wch: Math.min(40, Math.max(String(h).length, ...rows.map(r => String(r[i] ?? '').length)))
  }));
  (ws as any)['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  const ts = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, `orders_${ts}.xlsx`);
};

// ===================== Sub Components ===================== //

const OrderCard: React.FC<{
  order: Order;
  formatCurrency: (n: number) => string;
  onUpdateStatus: (id: string, s: OrderStatus) => void | Promise<void>;
  onDelete: () => void;
}> = ({ order, formatCurrency, onUpdateStatus, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localStatus, setLocalStatus] = useState<OrderStatus>(order.status);

  const handleStatusChange = async (next: OrderStatus) => {
    if (next === localStatus) return;
    setLocalStatus(next);
    setBusy(true);
    try {
      const maybePromise = onUpdateStatus(order.id, next);
      await Promise.resolve(maybePromise);
    } finally {
      setBusy(false);
    }
  };

  const paymentLabel = PAYMENT_LABEL[order.payment_method?.toLowerCase?.() || ''] || order.payment_method || '—';

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-black text-brand-primary truncate">#{order.id}</span>
        <StatusBadge status={localStatus} />
        <span className="ml-auto text-stone-400 text-[10px] font-bold">
          {new Date(order.created_at).toLocaleString('vi-VN', { hour12: false })}
        </span>
      </div>

      {/* Summary grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Info label="Khách hàng" value={order.customer?.name || '—'} />
        <Info label="Số điện thoại" value={order.customer?.phone || '—'} tel />
        <Info label="Phương thức" value={paymentLabel} />
        <Info label="Tổng tiền" value={formatCurrency(order.total_price)} emphasize />
      </div>

      {/* Address */}
      {order.customer?.address && (
        <div className="mt-3">
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Địa chỉ</p>
          <p className="text-xs font-black text-brand-secondary break-words">{order.customer.address}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusSelector value={localStatus} onChange={handleStatusChange} busy={busy} />
        <div className="flex gap-2">
          {order.customer?.phone && (
            <a
              href={`tel:${order.customer.phone}`}
              className="px-4 py-3 rounded-xl bg-stone-50 text-brand-secondary hover:bg-brand-accent hover:text-white transition font-black text-[10px] uppercase tracking-widest"
              aria-label="Gọi khách"
            >
              Gọi khách
            </a>
          )}
          <button
            onClick={() => {
              if (confirm('Xóa đơn hàng này? Hành động không thể hoàn tác.')) onDelete();
            }}
            className="px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition font-black text-[10px] uppercase tracking-widest"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Items (accordion) */}
      <button
        onClick={() => setOpen(!open)}
        className="mt-4 w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-brand-secondary"
        aria-expanded={open}
        aria-controls={`order-${order.id}-items`}
      >
        Chi tiết đơn ({order.items?.length || 0} sản phẩm)
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90 text-brand-secondary' : ''}`} />
      </button>

      <div
        id={`order-${order.id}-items`}
        className={`overflow-hidden transition-all ${open ? 'mt-2 max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="rounded-2xl border border-stone-100 bg-stone-50/50 p-4">
          {(order.items || []).map((it, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0 border-stone-100">
              <div className="min-w-0">
                <p className="text-xs font-black text-brand-secondary truncate">{it.name}</p>
                <p className="text-[10px] font-bold text-stone-400">SL: {it.quantity}</p>
              </div>
              <div className="text-xs font-black text-brand-primary">
                {formatCurrency((it.price ?? 0) * (it.quantity ?? 0))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileBottomTabs: React.FC<{
  active: 'stats' | 'orders' | 'products' | 'customers';
  onChange: (t: 'stats' | 'orders' | 'products' | 'customers') => void;
}> = ({ active, onChange }) => {
  const tabs: { id: 'stats' | 'orders' | 'products' | 'customers'; label: string; icon: React.FC<any> }[] = [
    { id: 'stats',     label: 'Tổng quan',  icon: BarChart3 },
    { id: 'orders',    label: 'Đơn hàng',   icon: ShoppingCart },
    { id: 'products',  label: 'Sản phẩm',   icon: Box },
    { id: 'customers', label: 'Khách hàng', icon: Users },
  ];
  return (
    <nav
      className="
        sm:hidden fixed left-0 right-0 bottom-0 z-[350]
        bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70
        border-t border-stone-200
        px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0)+10px)]
      "
      role="tablist"
      aria-label="Điều hướng nhanh"
    >
      <ul className="grid grid-cols-4 gap-1">
        {tabs.map(t => {
          const ActiveIcon = t.icon;
          const isActive = active === t.id;
          return (
            <li key={t.id}>
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(t.id)}
                className={`w-full flex flex-col items-center justify-center gap-1 py-2 rounded-xl
                  ${isActive ? 'text-brand-secondary bg-stone-100' : 'text-stone-500 active:bg-stone-50'}`}
              >
                <ActiveIcon className={`w-5 h-5 ${isActive ? 'text-brand-accent' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// ===================== Main Component ===================== //

type Tab = 'stats' | 'orders' | 'products' | 'customers';

const AdminDashboard: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void | Promise<void>;
  deleteOrder: (id: string) => void | Promise<void>;
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
  const [loading, setLoading] = useState(false); // Nếu bạn có fetch async, setLoading theo thực tế.

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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // ===== Derived data =====
  const stats = useMemo(() => {
    const totalRev = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_price ?? 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalCustomers = new Set(orders.map(o => o.customer?.phone).filter(Boolean)).size;
    return { totalRev, pendingOrders, totalCustomers };
  }, [orders]);

  const customers = useMemo(() => {
    const unique = new Map<string, { name: string; phone: string; address?: string; totalSpent: number; orderCount: number; lastOrder: string }>();
    orders.forEach(o => {
      const phone = o.customer?.phone;
      if (!phone) return;
      if (!unique.has(phone)) {
        unique.set(phone, {
          name: o.customer?.name || '—',
          phone,
          address: o.customer?.address,
          totalSpent: o.total_price ?? 0,
          orderCount: 1,
          lastOrder: o.created_at
        });
      } else {
        const existing = unique.get(phone)!;
        unique.set(phone, {
          ...existing,
          totalSpent: (existing.totalSpent ?? 0) + (o.total_price ?? 0),
          orderCount: existing.orderCount + 1,
          lastOrder: o.created_at > existing.lastOrder ? o.created_at : existing.lastOrder
        });
      }
    });
    return Array.from(unique.values());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return orders.filter((o) => {
      const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
      const matchesSearch =
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').includes(q) ||
        (o.id || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, orderFilter, searchQuery]);

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [products, searchQuery]
  );

  const filteredCustomers = useMemo(() =>
    customers.filter(c =>
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').includes(searchQuery)
    ),
    [customers, searchQuery]
  );

  const deleteProduct = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  if (!isOpen) return null;

  // ===================== Auth Overlay ===================== //
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

  // ===================== Layout ===================== //
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 overflow-hidden">
      <div className="absolute inset-0 bg-brand-secondary/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={handleClose} />

      <div className="relative w-full max-w-7xl h-full sm:h-[95vh] bg-stone-50 rounded-none sm:rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border border-white/10">

        {/* Sidebar (ẩn trên mobile) */}
        <aside className="hidden sm:flex sm:w-72 bg-white border-r border-stone-100 flex-col h-full">
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

        {/* Content */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header */}
          <header className="h-20 bg-white border-b border-stone-100 px-8 flex items-center justify-between flex-shrink-0">
            <h2 className="text-sm font-black text-brand-secondary uppercase tracking-[0.2em]">
              {activeTab === 'stats' && 'Thống kê tổng quan'}
              {activeTab === 'orders' && 'Quản lý vận đơn'}
              {activeTab === 'products' && 'Kho sản phẩm'}
              {activeTab === 'customers' && 'Hồ sơ khách hàng'}
            </h2>

            {/* Search desktop */}
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

          {/* Main */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-10 no-scrollbar bg-stone-50/50 pb-28 sm:pb-10">

            {/* ===== STATS TAB ===== */}
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

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Sticky controls for mobile */}
                <div className="sticky -top-2 sm:top-0 z-10 bg-stone-50/80 backdrop-blur supports-[backdrop-filter]:bg-stone-50/60 pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="relative w-full sm:hidden">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                      <input
                        type="text"
                        inputMode="search"
                        placeholder="Tìm đơn theo tên, SĐT hoặc mã đơn…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-brand-accent transition-all"
                        aria-label="Tìm kiếm đơn hàng"
                      />
                    </div>
                  </div>

                  {/* Filter chips */}
                  <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                    {(['all','pending','processing','completed','cancelled'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setOrderFilter(s)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap
                          ${orderFilter === s ? 'bg-brand-secondary text-white border-brand-secondary shadow' : 'bg-white text-stone-500 border-stone-200'}`}
                      >
                        {s === 'all' ? 'Tất cả' : STATUS_META[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tool bar: thống kê + Export */}
                <div className="mt-2 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-[11px] font-black text-stone-500 uppercase tracking-widest">
                    Hiển thị {filteredOrders.length} đơn {orderFilter !== 'all' ? `(${STATUS_META[orderFilter as OrderStatus]?.label})` : ''}
                  </div>

                  {/* Desktop buttons */}
                  <div className="hidden sm:flex gap-2">
                    <button
                      disabled={filteredOrders.length === 0}
                      onClick={() => exportOrdersToCSV(filteredOrders)}
                      className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                    >
                      Xuất CSV
                    </button>
                    <button
                      disabled={filteredOrders.length === 0}
                      onClick={() => exportOrdersToXLSX(filteredOrders)}
                      className="px-4 py-2 rounded-xl bg-brand-secondary text-white hover:bg-brand-primary disabled:opacity-50 text-[10px] font-black uppercase tracking-widest shadow"
                    >
                      Xuất Excel
                    </button>
                  </div>

                  {/* Mobile buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:hidden">
                    <button
                      disabled={filteredOrders.length === 0}
                      onClick={() => exportOrdersToCSV(filteredOrders)}
                      className="px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-600 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                    >
                      CSV
                    </button>
                    <button
                      disabled={filteredOrders.length === 0}
                      onClick={() => exportOrdersToXLSX(filteredOrders)}
                      className="px-4 py-3 rounded-xl bg-brand-secondary text-white disabled:opacity-50 text-[10px] font-black uppercase tracking-widest shadow"
                    >
                      Excel
                    </button>
                  </div>
                </div>

                {/* Orders list */}
                <div className="grid gap-4">
                  {loading && (
                    <>
                      <OrderSkeleton />
                      <OrderSkeleton />
                    </>
                  )}

                  {!loading && filteredOrders.length === 0 && (
                    <div className="bg-white p-10 rounded-3xl border border-stone-100 text-center">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-black text-brand-secondary">Không tìm thấy đơn nào</p>
                      <p className="text-[10px] font-bold text-stone-400 mt-1">Thử đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  )}

                  {!loading && filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      formatCurrency={formatCurrency}
                      onDelete={() => deleteOrder(order.id)}
                      onUpdateStatus={updateStatus}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ===== PRODUCTS TAB ===== */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
                    Hiển thị {filteredProducts.length} sản phẩm
                  </div>
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
                              <button onClick={() => deleteProduct(product.id)} className="p-2 text-stone-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== CUSTOMERS TAB ===== */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-brand-accent group-hover:bg-brand-secondary group-hover:text-white transition-all">
                          <Users className="w-8 h-8" />
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
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                          <span>Số đơn:</span>
                          <span className="text-brand-secondary">{customer.orderCount}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${customer.phone}`}
                          className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-lg active:scale-95"
                        >
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

      {/* Bottom tabs cho mobile */}
      <MobileBottomTabs
        active={activeTab}
        onChange={(t) => { setActiveTab(t); setSearchQuery(''); }}
      />
    </div>
  );
};

export default AdminDashboard;
``
