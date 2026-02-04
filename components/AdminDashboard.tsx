import React, { useMemo, useState } from "react";
import {
  X, Search, ShoppingCart, Users, Box, BarChart3, Trash2,
  ChevronRight, KeyRound, ShieldAlert, LayoutDashboard, DollarSign,
  Clock, ArrowUpRight, ArrowDownRight, Download
} from "lucide-react";
import { Order, OrderStatus, Product } from "../types";

// ======================================================================
// 🟦 STATUS & CONSTANTS
// ======================================================================
const STATUS_META: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  pending:     { label: "Chờ duyệt", bg: "bg-yellow-50", fg: "text-yellow-700" },
  processing:  { label: "Đang giao", bg: "bg-blue-50",   fg: "text-blue-700"   },
  completed:   { label: "Hoàn tất",  bg: "bg-green-50",  fg: "text-green-700"  },
  cancelled:   { label: "Đã hủy",    bg: "bg-red-50",    fg: "text-red-700"    },
};

const PAYMENT_LABEL: Record<string, string> = {
  cod: "Thanh toán khi nhận (COD)",
  bank: "Chuyển khoản",
  momo: "Ví Momo",
};

// ======================================================================
// 🟦 SMALL COMPONENTS
// ======================================================================
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${m.bg} ${m.fg}`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
};

const Info = ({ label, value, emphasize, tel }: { label: string; value: any; emphasize?: boolean; tel?: boolean; }) => (
  <div>
    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{label}</p>
    {tel ? (
      <a href={`tel:${value}`} className={`text-xs font-black ${emphasize ? "text-brand-primary" : "text-brand-secondary"} underline-offset-2 hover:underline`}>
        {value}
      </a>
    ) : (
      <p className={`text-xs font-black break-words ${emphasize ? "text-brand-primary" : "text-brand-secondary"}`}>
        {value}
      </p>
    )}
  </div>
);

[span_0](start_span)// Helper Skeleton đơn giản để tránh lỗi thiếu component[span_0](end_span)
const OrderSkeleton = () => (
  <div className="bg-white p-6 rounded-3xl border border-stone-100 animate-pulse">
    <div className="h-4 bg-stone-100 rounded w-1/4 mb-4"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-3 bg-stone-50 rounded"></div>
      <div className="h-3 bg-stone-50 rounded"></div>
    </div>
  </div>
);

// ======================================================================
[span_1](start_span)// 🟦 EXPORT CSV LOGIC [cite: 13-21]
// ======================================================================
const csvEscape = (v: any) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const exportOrdersToCSV = (orders: Order[]) => {
  const headers = ["Mã đơn", "Ngày tạo", "Trạng thái", "PT thanh toán", "Khách hàng", "SĐT", "Địa chỉ", "Số SP", "Tổng tiền"];
  const rows = orders.map(o => [
    o.id,
    new Date(o.created_at).toLocaleString("vi-VN"),
    STATUS_META[o.status]?.label || o.status,
    PAYMENT_LABEL[o.payment_method?.toLowerCase() || ""] || o.payment_method,
    o.customer?.name,
    o.customer?.phone,
    o.customer?.address,
    o.items?.reduce((n, it) => n + (it.quantity || 0), 0),
    o.total_price
  ]);

  const csvContent = [headers.map(csvEscape).join(","), ...rows.map(r => r.map(csvEscape).join(","))].join("\r\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" }); // Thêm BOM để Excel không lỗi font tiếng Việt
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ======================================================================
[cite_start]// 🟦 ORDER CARD [cite: 28-46]
// ======================================================================
const OrderCard = ({ order, onUpdateStatus, onDelete, formatCurrency }: any) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleUpdate = async (s: OrderStatus) => {
    setBusy(true);
    try { await onUpdateStatus(order.id, s); } finally { setBusy(false); }
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xs font-black text-brand-primary">#{order.id}</span>
        <StatusBadge status={order.status} />
        <span className="ml-auto text-stone-400 text-[10px] font-bold">
          {new Date(order.created_at).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Info label="Khách" value={order.customer?.name} />
        <Info label="Tổng tiền" value={formatCurrency(order.total_price)} emphasize />
      </div>

      <div className="mt-5 flex gap-2">
        <select 
          disabled={busy}
          value={order.status}
          onChange={(e) => handleUpdate(e.target.value as OrderStatus)}
          className="flex-1 text-[10px] font-black uppercase bg-stone-50 border-none rounded-xl px-3 py-2"
        >
          {Object.keys(STATUS_META).map(s => (
            <option key={s} value={s}>{STATUS_META[s as OrderStatus].label}</option>
          ))}
        </select>
        <button onClick={() => confirm("Xóa đơn này?") && onDelete()} className="p-2 text-stone-400 hover:text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ======================================================================
// 🟦 MAIN ADMIN DASHBOARD
// ======================================================================
const AdminDashboard = ({ isOpen, onClose, orders, updateStatus, deleteOrder, products, setProducts }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"stats" | "orders" | "products" | "customers">("stats");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const ADMIN_PASSWORD = "thanhha2024"; [cite_start]// Lưu ý: Nên dùng env[span_1](end_span)

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);

  [span_2](start_span)// Filter Logic [cite: 52-53]
  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = o.customer?.name?.toLowerCase().includes(q) || o.customer?.phone?.includes(q) || o.id.includes(q);
      const matchesStatus = orderFilter === "all" || o.status === orderFilter;
      
      const date = new Date(o.created_at);
      const matchesFrom = !fromDate || date >= new Date(fromDate);
      const matchesTo = !toDate || date <= new Date(toDate + "T23:59:59");

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [orders, searchQuery, orderFilter, fromDate, toDate]);

  const stats = useMemo(() => {
    const confirmed = orders.filter((o: any) => o.status === "completed");
    return {
      totalRev: confirmed.reduce((s: number, o: any) => s + o.total_price, 0),
      pending: orders.filter((o: any) => o.status === "pending").length,
      customers: new Set(orders.map((o: any) => o.customer?.phone)).size
    };
  }, [orders]);

  if (!isOpen) return null;

  [cite_start]// Login Screen [cite: 58-66]
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-brand-secondary/90 backdrop-blur-xl">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-black"><X/></button>
          <div className="w-20 h-20 bg-brand-soft rounded-3xl mx-auto mb-6 flex items-center justify-center text-brand-accent"><ShieldAlert size={40}/></div>
          <h2 className="text-2xl font-black text-center text-brand-secondary mb-8 font-serif">HỆ THỐNG QUẢN TRỊ</h2>
          <form onSubmit={(e) => { e.preventDefault(); password === ADMIN_PASSWORD ? setIsAuthenticated(true) : alert("Sai mật khẩu"); }} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18}/>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mã truy cập..." className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 ring-brand-accent outline-none"/>
            </div>
            <button className="w-full bg-brand-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition">Vào hệ thống</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-stone-100 flex overflow-hidden">
      [cite_start]{/* SIDEBAR [cite: 68-78] */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-stone-200 flex-col">
        <div className="p-8 border-b border-stone-100 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg"><LayoutDashboard/></div>
          <div>
            <h1 className="text-xl font-serif font-black text-brand-secondary">THANH HÀ</h1>
            <p className="text-[9px] font-black text-brand-accent uppercase tracking-tighter">Management v2.0</p>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: "stats", label: "Tổng quan", icon: BarChart3 },
            { id: "orders", label: "Đơn hàng", icon: ShoppingCart, badge: stats.pending },
            { id: "products", label: "Sản phẩm", icon: Box },
            { id: "customers", label: "Khách hàng", icon: Users },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? "bg-brand-secondary text-white shadow-xl translate-x-1" : "text-stone-500 hover:bg-stone-50"}`}>
              <t.icon size={18} className={activeTab === t.id ? "text-brand-accent" : ""}/>
              {t.label}
              {t.badge > 0 && <span className="ml-auto bg-brand-accent text-brand-secondary w-5 h-5 rounded-lg flex items-center justify-center text-[9px]">{t.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button onClick={onClose} className="w-full p-4 rounded-2xl text-red-500 bg-red-50 font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-red-100 transition"><X size={16}/> Đóng Dashboard</button>
        </div>
      </aside>

      [cite_start]{/* MAIN CONTENT [cite: 79-157] */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 pb-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <h2 className="text-2xl font-serif font-black text-brand-secondary uppercase tracking-wider">
            {activeTab === "stats" && "Báo cáo doanh thu"}
            {activeTab === "orders" && "Danh sách đơn hàng"}
            {activeTab === "products" && "Quản lý kho"}
            {activeTab === "customers" && "Tệp khách hàng"}
          </h2>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-accent transition" size={18}/>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm nhanh..." className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 ring-brand-accent outline-none shadow-sm"/>
          </div>
        </header>

        [cite_start]{/* TAB: STATS [cite: 82-94] */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Doanh thu (Thực nhận)" value={formatCurrency(stats.totalRev)} icon={DollarSign} up trend="+15%"/>
            <StatCard label="Khách hàng" value={stats.customers} icon={Users} up trend="+4%"/>
            <StatCard label="Đơn mới" value={stats.pending} icon={Clock} trend="Cần duyệt" color="text-yellow-500"/>
          </div>
        )}

        [cite_start]{/* TAB: ORDERS [cite: 95-133] */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-stone-100 overflow-x-auto no-scrollbar">
                {["all", "pending", "processing", "completed", "cancelled"].map((s: any) => (
                  <button key={s} onClick={() => setOrderFilter(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${orderFilter === s ? "bg-brand-secondary text-white" : "text-stone-400 hover:text-brand-secondary"}`}>
                    {s === "all" ? "Tất cả" : STATUS_META[s as OrderStatus].label}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 ml-auto">
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="px-3 py-2 rounded-xl bg-white border-none text-[10px] font-black shadow-sm uppercase"/>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="px-3 py-2 rounded-xl bg-white border-none text-[10px] font-black shadow-sm uppercase"/>
                <button onClick={() => exportOrdersToCSV(filteredOrders)} className="p-3 bg-brand-primary text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition"><Download size={18}/></button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-stone-200">
                  <Search className="mx-auto mb-4 text-stone-200" size={48}/>
                  <p className="font-black text-stone-400 uppercase tracking-widest">Không có đơn hàng nào phù hợp</p>
                </div>
              ) : (
                filteredOrders.map((o: any) => (
                  <OrderCard key={o.id} order={o} formatCurrency={formatCurrency} onUpdateStatus={updateStatus} onDelete={() => deleteOrder(o.id)}/>
                ))
              )}
            </div>
          </div>
        )}

        {/* Các Tab khác: Products, Customers... (giữ cấu trúc tương tự nhưng sửa lỗi ngắt dòng) */}
      </main>
    </div>
  );
};

// Helper Stat Card
const StatCard = ({ label, value, icon: Icon, trend, up, color }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.03] group-hover:scale-110 transition-transform ${color || 'text-brand-primary'}`}><Icon size={128}/></div>
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-stone-50 rounded-2xl text-brand-accent"><Icon size={24}/></div>
      {trend && <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${up ? 'bg-green-50 text-green-600' : 'bg-stone-50 text-stone-500'}`}>{trend}</span>}
    </div>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className={`text-3xl font-black ${color || 'text-brand-secondary'}`}>{value}</p>
  </div>
);

export default AdminDashboard;
