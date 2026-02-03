import React, { useMemo, useState } from "react";
import {
  X, Search, ShoppingCart, Users, Box, BarChart3, Phone, Trash2,
  ChevronRight, KeyRound, ShieldAlert, LayoutDashboard, DollarSign,
  Clock, ArrowUpRight, ArrowDownRight
} from "lucide-react";

import { Order, OrderStatus, Product } from "../types";

// ======================================================================
// 🟦 STATUS META
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
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${m.bg} ${m.fg}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
};

const StatusSelector = ({
  value,
  busy,
  onChange,
}: {
  value: OrderStatus;
  busy?: boolean;
  onChange: (s: OrderStatus) => void | Promise<void>;
}) => {
  const options: OrderStatus[] = ["pending", "processing", "completed", "cancelled"];
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1 bg-stone-50 rounded-xl border border-stone-100">
      {options.map((opt) => {
        const active = value === opt;
        const base =
          "whitespace-nowrap px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest";
        const cls = active
          ? "bg-brand-secondary text-white shadow"
          : "bg-white text-stone-500 border border-stone-100";
        return (
          <button
            key={opt}
            disabled={busy}
            onClick={() => onChange(opt)}
            className={`${base} ${cls} disabled:opacity-60 active:scale-[0.98] transition`}
          >
            {STATUS_META[opt].label}
          </button>
        );
      })}
    </div>
  );
};

const OrderSkeleton = () => (
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

const Info = ({
  label,
  value,
  emphasize,
  tel,
}: {
  label: string;
  value: any;
  emphasize?: boolean;
  tel?: boolean;
}) => (
  <div>
    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{label}</p>
    {tel ? (
      <a
        href={`tel:${value}`}
        className={`text-xs font-black ${
          emphasize ? "text-brand-primary" : "text-brand-secondary"
        } underline-offset-2 hover:underline`}
      >
        {value}
      </a>
    ) : (
      <p
        className={`text-xs font-black break-words ${
          emphasize ? "text-brand-primary" : "text-brand-secondary"
        }`}
      >
        {value}
      </p>
    )}
  </div>
);

// ======================================================================
// 🟦 EXPORT CSV (no dependency)
// ======================================================================
type RowPrimitive = string | number | null | undefined;

const csvEscape = (v: RowPrimitive) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const makeOrderRows = (orders: Order[]) => {
  const headers = [
    "Mã đơn",
    "Ngày tạo",
    "Trạng thái",
    "PT thanh toán",
    "Khách hàng",
    "SĐT",
    "Địa chỉ",
    "Số SP",
    "Chi tiết SP",
    "Tổng tiền",
  ];

  const rows = orders.map((o) => {
    const items = o.items || [];
    const itemsCount = items.reduce((n, it) => n + (it.quantity ?? 0), 0);
    const itemsDetail = items.map((it) => `${it.name} x${it.quantity}`).join(" | ");
    const created = new Date(o.created_at).toLocaleString("vi-VN", { hour12: false });

    return [
      o.id,
      created,
      STATUS_META[o.status]?.label ?? o.status,
      PAYMENT_LABEL[o.payment_method?.toLowerCase?.() || ""] || o.payment_method || "",
      o.customer?.name || "",
      o.customer?.phone || "",
      o.customer?.address || "",
      itemsCount,
      itemsDetail,
      o.total_price ?? 0,
    ] as RowPrimitive[];
  });

  return { headers, rows };
};

export const exportOrdersToCSV = (orders: Order[]) => {
  const { headers, rows } = makeOrderRows(orders);
  const csv =
    [headers.map(csvEscape).join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const ts = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = `orders_${ts}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ======================================================================
// 🟦 EXPORT XLSX (NO XLSX LIB — 100% ZIP + XML)
// ======================================================================
export const exportOrdersToXLSX = async (orders: Order[]) => {
  const JSZip = (await import("jszip")).default; // 👈 Lazy import — FIX Vercel

  const { headers, rows } = makeOrderRows(orders);

  const sheetData = [
    `<row>${headers
      .map((h) => `<c t="inlineStr"><is><t>${h}</t></is></c>`)
      .join("")}</row>`,
    ...rows.map(
      (r) =>
        `<row>${r
          .map(
            (v) =>
              `<c t="inlineStr"><is><t>${String(v ?? "")}</t></is></c>`
          )
          .join("")}</row>`
    ),
  ].join("");

  const sheetXML = `
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheetData>${sheetData}</sheetData>
    </worksheet>
  `.trim();

  const workbookXML = `
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
              xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
      <sheets>
        <sheet name="Orders" sheetId="1" r:id="rId1"/>
      </sheets>
   .file(
    "[Content_Types].xml",
    `
      <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="xml" ContentType="application/xml"/>
        <Override PartName="/xl/workbook.xml"
          ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
        <Override PartName="/xl/worksheets/sheet1.xml"
          ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
      </Types>
    `.trim()
  );

  const xl = zip.folder("xl")!;
  xl.file("workbook.xml", workbookXML);
  xl.folder("_rels")!.file("workbook.xml.rels", relsXML);
  xl.folder("worksheets")!.file("sheet1.xml", sheetXML);

  const blob = await zip.generateAsync({ type: "blob" });

  const ts = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = `orders_${ts}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

// ======================================================================
// 🟦 MOBILE BOTTOM TABS
// ======================================================================
const MobileBottomTabs = ({
  active,
  onChange,
}: {
  active: "stats" | "orders" | "products" | "customers";
  onChange: (t: "stats" | "orders" | "products" | "customers") => void;
}) => {
  const tabs = [
    { id: "stats", label: "Tổng quan", icon: BarChart3 },
    { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
    { id: "products", label: "Sản phẩm", icon: Box },
    { id: "customers", label: "Khách hàng", icon: Users },
  ];

  return (
    <nav
      className="
        sm:hidden fixed left-0 right-0 bottom-0 z-[350]
        bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70
        border-t border-stone-200 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0)+10px)]
      "
    >
      <ul className="grid grid-cols-4 gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <li key={t.id}>
              <button
                onClick={() => onChange(t.id as any)}
                className={`w-full flex flex-col items-center justify-center gap-1 py-2 rounded-xl ${
                  isActive
                    ? "text-brand-secondary bg-stone-100"
                    : "text-stone-500 active:bg-stone-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-accent" : ""}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// ======================================================================
// 🟦 ORDER CARD COMPONENT
// ======================================================================
const OrderCard = ({
  order,
  onUpdateStatus,
  onDelete,
  formatCurrency,
}: {
  order: Order;
  formatCurrency: (n: number) => string;
  onUpdateStatus: (id: string, s: OrderStatus) => void | Promise<void>;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localStatus, setLocalStatus] = useState<OrderStatus>(order.status);

  const update = async (next: OrderStatus) => {
    if (next === localStatus) return;
    setBusy(true);
    setLocalStatus(next);
    try {
      await onUpdateStatus(order.id, next);
    } finally {
      setBusy(false);
    }
  };

  const payLabel =
    PAYMENT_LABEL[order.payment_method?.toLowerCase?.()] ||
    order.payment_method ||
    "—";

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-100 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xs font-black text-brand-primary truncate">
          #{order.id}
        </span>
        <StatusBadge status={localStatus} />
        <span className="ml-auto text-stone-400 text-[10px] font-bold">
          {new Date(order.created_at).toLocaleString("vi-VN", { hour12: false })}
        </span>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Info label="Khách hàng" value={order.customer?.name || "—"} />
        <Info label="SĐT" value={order.customer?.phone || "—"} tel />
        <Info label="Phương thức" value={payLabel} />
        <Info
          label="Tổng tiền"
          value={formatCurrency(order.total_price)}
          emphasize
        />
      </div>
      <div className="mt-3">
        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">
          Sản phẩm
        </p>
        <p className="text-xs font-black text-brand-secondary break-words">
          {order.items.map(it => `${it.name} x${it.quantity}`).join(", ")}
        </p>
      </div>

      {order.customer?.address && (
        <div className="mt-3">
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">
            Địa chỉ
          </p>
          <p className="text-xs font-black text-brand-secondary break-words">
            {order.customer.address}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusSelector value={localStatus} busy={busy} onChange={update} />

        <div className="flex gap-2">
          {order.customer?.phone && (
            <a
              href={`tel:${order.customer.phone}`}
              className="px-4 py-3 rounded-xl bg-stone-50 text-brand-secondary hover:bg-brand-accent hover:text-white transition font-black text-[10px] uppercase tracking-widest"
            >
              Gọi khách
            </a>
          )}
          <button
            onClick={() => {
              if (confirm("Xóa đơn hàng này?")) onDelete();
            }}
            className="px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-500 hover:bg-red-50 hover:text-red-600 transition font-black text-[10px] uppercase tracking-widest"
          >
            Xóa
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="mt-4 w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-brand-secondary"
      >
        Chi tiết đơn ({order.items?.length || 0} sản phẩm)
        <ChevronRight
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-90 text-brand-secondary" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all ${
          open ? "mt-2 max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="rounded-2xl border border-stone-100 bg-stone-50/50 p-4">
          {order.items?.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b last:border-0 border-stone-100"
            >
              <div className="min-w-0">
                <p className="text-xs font-black text-brand-secondary truncate">
                  {it.name}
                </p>
                <p className="text-[10px] font-bold text-stone-400">
                  SL: {it.quantity}
                </p>
              </div>
              <p className="text-xs font-black text-brand-primary">
                {formatCurrency((it.price ?? 0) * (it.quantity ?? 0))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// 🟦 MAIN ADMIN DASHBOARD
// ======================================================================
const AdminDashboard = ({
  isOpen,
  onClose,
  orders,
  updateStatus,
  deleteOrder,
  products,
  setProducts,
}: {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void | Promise<void>;
  deleteOrder: (id: string) => void | Promise<void>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState<"stats" | "orders" | "products" | "customers">(
    "stats"
  );
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 👉 Bộ lọc thời gian
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading] = useState(false);

  const ADMIN_PASSWORD = "thanhha2024";

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);

  // ======================================================================
  // 🔍 FILTER ORDERS
  // ======================================================================
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return orders.filter((o) => {
      const matchesStatus =
        orderFilter === "all" || o.status === orderFilter;

      const matchesSearch =
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.id.toLowerCase().includes(q);

      // Date range
      const created = new Date(o.created_at);
      if (fromDate && created < new Date(fromDate)) return false;
      if (toDate && created > new Date(toDate + "T23:59:59")) return false;

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilter, searchQuery, fromDate, toDate]);

  // ======================================================================
  // 📊 Stats
  // ======================================================================
  const stats = useMemo(() => {
    const totalRev = orders
      .filter((o) => o.status === "completed")
      .reduce((s, o) => s + o.total_price, 0);

    const pending = orders.filter((o) => o.status === "pending").length;
    const customers = new Set(
      orders.map((o) => o.customer?.phone).filter(Boolean)
    ).size;

    return { totalRev, pending, customers };
  }, [orders]);

  // ======================================================================
  // 👤 Customers grouped
  // ======================================================================
  const customersGrouped = useMemo(() => {
    const map = new Map<string, any>();
    orders.forEach((o) => {
      if (!o.customer?.phone) return;
      if (!map.has(o.customer.phone)) {
        map.set(o.customer.phone, {
          name: o.customer.name,
          phone: o.customer.phone,
          totalSpent: o.total_price,
          orderCount: 1,
        });
      } else {
        const c = map.get(o.customer.phone);
        c.totalSpent += o.total_price;
        c.orderCount += 1;
      }
    });
    return [...map.values()];
  }, [orders]);

  // ======================================================================
  // 🔒 Login
  // ======================================================================
  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-brand-secondary/90 backdrop-blur-xl" />

        <div className="relative w-full max-w-md bg-white rounded-[2rem] p-10 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-stone-300 hover:text-brand-secondary"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-20 h-20 bg-brand-soft rounded-3xl mx-auto mb-8 flex items-center justify-center text-brand-accent">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-serif font-black text-brand-secondary text-center">
            Khu Vực Nội Bộ
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) {
                setIsAuthenticated(true);
                setLoginError(false);
              } else {
                setLoginError(true);
              }
            }}
            className="mt-8 space-y-4"
          >
            <div className="relative">
              <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu hệ thống"
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-stone-50 border text-xs font-bold ${
                  loginError ? "border-red-500" : "border-stone-200"
                }`}
              />
            </div>

            {loginError && (
              <p className="text-[11px] text-center text-red-500 font-bold">
                Mật khẩu không chính xác
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em]"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ======================================================================
  // 🟩 MAIN UI
  // ======================================================================
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-7xl h-full sm:h-[95vh] bg-stone-50 rounded-none sm:rounded-[2rem] shadow-xl flex overflow-hidden">

        {/* ================= SIDEBAR (desktop only) ================= */}
        <aside className="hidden sm:flex sm:w-72 bg-white border-r border-stone-100 flex-col">
          <div className="p-8 border-b border-stone-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black text-brand-secondary">
                THANH HÀ
              </h1>
              <p className="text-[9px] font-black text-brand-accent uppercase">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            {[
              { id: "stats", label: "Tổng quan", icon: BarChart3 },
              { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
              { id: "products", label: "Sản phẩm", icon: Box },
              { id: "customers", label: "Khách hàng", icon: Users },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest ${
                    active
                      ? "bg-brand-secondary text-white shadow"
                      : "text-stone-500 hover:bg-stone-50 hover:text-brand-secondary"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active ? "text-brand-accent" : ""
                    }`}
                  />
                  {t.label}

                  {t.id === "orders" && stats.pending > 0 && (
                    <span className="ml-auto bg-brand-accent text-brand-secondary w-5 h-5 rounded-lg flex items-center justify-center text-[9px]">
                      {stats.pending}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-stone-100">
            <button
              onClick={onClose}
              className="w-full px-5 py-4 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-500 flex items-center gap-3"
            >
              <X className="w-5 h-5" /> Thoát hệ thống
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 pb-28 sm:pb-10 no-scrollbar">

          {/* =============================================================
             HEADER for Desktop Search 
          ============================================================= */}
          <div className="hidden sm:flex justify-between items-center mb-8">
            <h2 className="text-sm font-black uppercase text-brand-secondary tracking-[0.2em]">
              {activeTab === "stats" && "Thống kê tổng quan"}
              {activeTab === "orders" && "Quản lý đơn hàng"}
              {activeTab === "products" && "Kho sản phẩm"}
              {activeTab === "customers" && "Hồ sơ khách hàng"}
            </h2>

            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm…"
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* =============================================================
             TAB — STATS
          ============================================================= */}
          {activeTab === "stats" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Doanh thu (xác nhận)",
                  value: formatCurrency(stats.totalRev),
                  icon: DollarSign,
                  trend: "+12%",
                  up: true,
                },
                {
                  label: "Khách hàng thân thiết",
                  value: stats.customers,
                  icon: Users,
                  trend: "+5%",
                  up: true,
                },
                {
                  label: "Đơn chờ duyệt",
                  value: stats.pending,
                  icon: Clock,
                  trend: "-2%",
                  up: false,
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
                  >
                    <div className="flex justify-between mb-4">
                      <div className="p-4 bg-stone-100 rounded-xl">
                        <Icon className="text-brand-accent w-6 h-6" />
                      </div>
                      <span
                        className={`px-2 py-1 text-[10px] font-black rounded ${
                          s.up
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {s.up ? <ArrowUpRight /> : <ArrowDownRight />}
                        {s.trend}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase text-stone-500 font-black tracking-widest">
                      {s.label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-brand-secondary">
                      {s.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* =============================================================
             TAB — ORDERS
          ============================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-6">

              {/* Mobile search */}
              <div className="sm:hidden relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm đơn theo tên, SĐT, mã đơn…"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Status filter chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {(["all", "pending", "processing", "completed", "cancelled"] as const).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setOrderFilter(s)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                        orderFilter === s
                          ? "bg-brand-secondary text-white border-brand-secondary"
                          : "bg-white text-stone-500 border-stone-200"
                      }`}
                    >
                      {s === "all" ? "Tất cả" : STATUS_META[s].label}
                    </button>
                  )
                )}
              </div>

              {/* Date filter */}
              <div className="flex gap-2 mt-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-[10px] font-black uppercase"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-[10px] font-black uppercase"
                />
              </div>

              {/* Export buttons */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-[11px] text-stone-500 font-black uppercase">
                  {filteredOrders.length} đơn phù hợp
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={filteredOrders.length === 0}
                    onClick={() => exportOrdersToCSV(filteredOrders)}
                    className="px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-xl text-[10px] font-black uppercase"
                  >
                    CSV
                  </button>
                  <button
                    disabled={filteredOrders.length === 0}
                    onClick={() => exportOrdersToXLSX(filteredOrders)}
                    className="px-4 py-2 bg-brand-secondary text-white rounded-xl text-[10px] font-black uppercase"
                  >
                    Excel
                  </button>
                </div>
              </div>

              {/* Orders list */}
              <div className="grid gap-4">
                {loading ? (
                  <>
                    <OrderSkeleton />
                    <OrderSkeleton />
                  </>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border text-center">
                    <Search className="mx-auto mb-3 text-stone-400 w-6 h-6" />
                    <p className="font-black text-brand-secondary">
                      Không tìm thấy đơn nào
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateStatus}
                      onDelete={() => deleteOrder(order.id)}
                      formatCurrency={formatCurrency}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* =============================================================
             TAB — PRODUCTS
          ============================================================= */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <p className="text-[11px] font-black text-stone-500 uppercase">
                {products.length} sản phẩm
              </p>

              <div className="bg-white rounded-2xl border">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                        Danh mục
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                        Giá
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <span className="font-black text-xs text-brand-secondary">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">{p.category}</td>
                        <td className="px-6 py-4 text-xs font-black text-brand-primary">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm("Xóa sản phẩm này?"))
                                setProducts((prev) =>
                                  prev.filter((x) => x.id !== p.id)
                                );
                            }}
                            className="text-stone-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================
             TAB — CUSTOMERS
          ============================================================= */}
          {activeTab === "customers" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customersGrouped.map((c, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-brand-secondary" />
                    </div>

                    <div>
                      <p className="font-black text-brand-secondary">
                        {c.name}
                      </p>
                      <p className="text-xs text-stone-400">{c.phone}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 font-black uppercase">
                    Tổng chi tiêu:
                  </p>
                  <p className="text-brand-primary font-black text-lg">
                    {formatCurrency(c.totalSpent)}
                  </p>

                  <p className="mt-4 text-xs text-stone-500 font-black uppercase">
                    Số đơn:
                  </p>
                  <p className="font-black text-brand-secondary">{c.orderCount}</p>

                  <a
                    href={`tel:${c.phone}`}
                    className="block mt-6 bg-brand-secondary text-white text-center py-3 rounded-xl font-black text-[10px] uppercase"
                  >
                    Gọi khách
                  </a>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

      {/* ================= BOTTOM TABS ================= */}
      <MobileBottomTabs active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default AdminDashboard;
