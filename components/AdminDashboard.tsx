
// ======================================================================
// 🟦 IMPORTS & TYPES
// ======================================================================
import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  X, Search, ShoppingCart, Users, Box, BarChart3, Trash2,
  ChevronRight, KeyRound, ShieldAlert, LayoutDashboard, DollarSign,
  Clock, ArrowUpRight, ArrowDownRight, Download, Plus, Edit, Eye,
  Filter, Calendar, UserCheck, Package, TrendingUp, AlertCircle,
  CheckCircle, Truck, RefreshCw, Bell, LogOut, Settings, CreditCard,
  MessageSquare, Star, MapPin, Phone, Mail, Globe, Camera
} from "lucide-react";
import { Order, OrderStatus, Product, Customer, DashboardStats } from "../types";

// ======================================================================
// 🟦 CONSTANTS & CONFIGS
// ======================================================================
const STATUS_META: Record<OrderStatus, { 
  label: string; 
  bg: string; 
  fg: string;
  icon: React.ReactNode;
}> = {
  pending: { 
    label: "Chờ duyệt", 
    bg: "bg-yellow-50", 
    fg: "text-yellow-700",
    icon: <Clock className="w-3 h-3" />
  },
  processing: { 
    label: "Đang giao", 
    bg: "bg-blue-50", 
    fg: "text-blue-700",
    icon: <Truck className="w-3 h-3" />
  },
  completed: { 
    label: "Hoàn tất", 
    bg: "bg-green-50", 
    fg: "text-green-700",
    icon: <CheckCircle className="w-3 h-3" />
  },
  cancelled: { 
    label: "Đã hủy", 
    bg: "bg-red-50", 
    fg: "text-red-700",
    icon: <X className="w-3 h-3" />
  },
};

const PAYMENT_METHODS = {
  cod: { label: "COD", color: "bg-orange-100 text-orange-700" },
  bank: { label: "Chuyển khoản", color: "bg-blue-100 text-blue-700" },
  momo: { label: "Momo", color: "bg-pink-100 text-pink-700" },
  zalopay: { label: "ZaloPay", color: "bg-blue-100 text-blue-700" },
  card: { label: "Thẻ", color: "bg-purple-100 text-purple-700" },
};

const CHART_COLORS = {
  revenue: "#4F46E5",
  orders: "#10B981",
  customers: "#F59E0B",
  products: "#8B5CF6"
};

// ======================================================================
// 🟦 COMPONENTS
// ======================================================================

// Status Badge Component
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${m.bg} ${m.fg}`}>
      {m.icon}
      {m.label}
    </span>
  );
};

// Info Display Component
const Info = ({ 
  label, 
  value, 
  emphasize, 
  tel, 
  email, 
  icon: Icon 
}: { 
  label: string; 
  value: any; 
  emphasize?: boolean; 
  tel?: boolean;
  email?: boolean;
  icon?: React.ElementType;
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 text-stone-400" />}
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</p>
    </div>
    {tel ? (
      <a 
        href={`tel:${value}`} 
        className={`block text-sm font-bold ${emphasize ? "text-brand-primary hover:text-brand-primary/80" : "text-stone-800 hover:text-brand-primary"} transition-colors`}
      >
        {value}
      </a>
    ) : email ? (
      <a 
        href={`mailto:${value}`} 
        className={`block text-sm font-bold ${emphasize ? "text-brand-primary hover:text-brand-primary/80" : "text-stone-800 hover:text-brand-primary"} transition-colors`}
      >
        {value}
      </a>
    ) : (
      <p className={`text-sm font-bold ${emphasize ? "text-brand-primary" : "text-stone-800"}`}>
        {value}
      </p>
    )}
  </div>
);

// Stat Card Component
const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  percentage, 
  color = "brand",
  loading = false 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: "up" | "down" | "neutral";
  percentage?: string;
  color?: "brand" | "green" | "blue" | "orange" | "purple";
  loading?: boolean;
}) => {
  const colorClasses = {
    brand: "text-brand-primary bg-brand-primary/10",
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50"
  };

  const trendIcons = {
    up: <ArrowUpRight className="w-4 h-4" />,
    down: <ArrowDownRight className="w-4 h-4" />,
    neutral: <TrendingUp className="w-4 h-4" />
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100"></div>
          <div className="w-16 h-6 bg-stone-100 rounded-lg"></div>
        </div>
        <div className="h-4 bg-stone-100 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-stone-100 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && percentage && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${trend === 'up' ? 'bg-green-50 text-green-600' : trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-stone-50 text-stone-600'}`}>
            {trendIcons[trend]}
            <span>{percentage}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-stone-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ 
  order, 
  onUpdateStatus, 
  onDelete, 
  formatCurrency,
  onViewDetail 
}: { 
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
  onViewDetail: (order: Order) => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleStatusUpdate = async (status: OrderStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const paymentMethod = order.payment_method?.toLowerCase() as keyof typeof PAYMENT_METHODS;
  const paymentInfo = PAYMENT_METHODS[paymentMethod] || { label: order.payment_method, color: "bg-stone-100 text-stone-700" };

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-brand-primary">#{order.id}</span>
            <StatusBadge status={order.status} />
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${paymentInfo.color}`}>
              {paymentInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">
              {new Date(order.created_at).toLocaleDateString('vi-VN')}
            </span>
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${showActions ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-900">{order.customer?.name}</p>
            <p className="text-xs text-stone-500">{order.customer?.phone}</p>
          </div>
          <p className="text-lg font-bold text-brand-primary">
            {formatCurrency(order.total_price)}
          </p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <Info label="Sản phẩm" value={order.items?.length || 0} />
        <Info label="Số lượng" value={order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} />
        <Info label="Địa chỉ" value={order.customer?.address} />
        <Info label="Ghi chú" value={order.note || "Không có"} />
      </div>

      {/* Actions (Collapsible) */}
      {showActions && (
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 animate-slideDown">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onViewDetail(order)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Xác nhận xóa đơn hàng #${order.id}?`)) {
                  onDelete(order.id);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>

          {/* Quick Status Update */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-600 mb-2">Cập nhật nhanh trạng thái:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_META).map(([status, meta]) => (
                <button
                  key={status}
                  disabled={isUpdating || order.status === status}
                  onClick={() => handleStatusUpdate(status as OrderStatus)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    order.status === status
                      ? `${meta.bg} ${meta.fg} cursor-default`
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {meta.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden group hover:shadow-md transition-shadow">
    <div className="relative aspect-square bg-stone-100 overflow-hidden">
      {product.image ? (
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-stone-400">
          <Package className="w-12 h-12" />
        </div>
      )}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button
          onClick={() => onEdit(product)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-stone-700 hover:text-brand-primary hover:bg-white transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Xác nhận xóa sản phẩm "${product.name}"?`)) {
              onDelete(product.id);
            }
          }}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-stone-700 hover:text-red-600 hover:bg-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="font-bold text-stone-900 mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-sm text-stone-600 mb-3 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-brand-primary">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </span>
        <div className="flex items-center gap-1 text-sm text-stone-500">
          <Package className="w-4 h-4" />
          <span>{product.stock || 0} sản phẩm</span>
        </div>
      </div>
      
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
        product.status === 'active' 
          ? 'bg-green-50 text-green-600' 
          : 'bg-red-50 text-red-600'
      }`}>
        {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
      </div>
    </div>
  </div>
);

// Customer Card Component
const CustomerCard = ({ customer }: { customer: Customer }) => (
  <div className="bg-white rounded-2xl border border-stone-100 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
        {customer.avatar ? (
          <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-xl object-cover" />
        ) : (
          <UserCheck className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-stone-900">{customer.name}</h3>
        <p className="text-sm text-stone-500">{customer.email}</p>
      </div>
      <button className="p-2 text-stone-400 hover:text-brand-primary rounded-lg hover:bg-stone-100">
        <MessageSquare className="w-4 h-4" />
      </button>
    </div>
    
    <div className="space-y-3">
      <Info label="SĐT" value={customer.phone} tel icon={Phone} />
      <Info label="Địa chỉ" value={customer.address || "Chưa cập nhật"} icon={MapPin} />
      
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="text-center">
          <p className="text-xs text-stone-500">Tổng đơn</p>
          <p className="font-bold text-stone-900">{customer.total_orders || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-stone-500">Tổng chi</p>
          <p className="font-bold text-brand-primary">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
              .format(customer.total_spent || 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-stone-500">Đánh giá</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-stone-900">{customer.rating || "5.0"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ======================================================================
// 🟦 UTILITIES
// ======================================================================

// CSV Export Utility
const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const escapeField = (field: any) => {
    if (field === null || field === undefined) return '';
    const string = String(field);
    return string.includes(',') || string.includes('"') || string.includes('\n')
      ? `"${string.replace(/"/g, '""')}"`
      : string;
  };

  const csvRows = [
    headers.map(escapeField).join(','),
    ...data.map(row => headers.map(header => escapeField(row[header])).join(','))
  ];

  const csvContent = csvRows.join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Filter Hook
const useFilter = <T,>(data: T[], filters: any) => {
  return useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        const itemValue = (item as any)[key];
        
        if (typeof value === 'string') {
          return String(itemValue).toLowerCase().includes(value.toLowerCase());
        }
        
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }
        
        return itemValue === value;
      });
    });
  }, [data, filters]);
};

// ======================================================================
// 🟦 MAIN ADMIN DASHBOARD
// ======================================================================

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  customers: Customer[];
  stats: DashboardStats;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onAddProduct: (product: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onExportData: (type: 'orders' | 'products' | 'customers') => void;
  onRefreshData: () => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  customers,
  stats,
  onUpdateOrderStatus,
  onDeleteOrder,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onExportData,
  onRefreshData
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Filter States
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'vip' | 'new'>('all');
  
  // Modal States
  const [showOrderDetail, setShowOrderDetail] = useState<Order | null>(null);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Configuration
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';
  
  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);
  
  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setAuthError('Mật khẩu không chính xác');
    }
  };
  
  // Handle refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshData();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle order view detail
  const handleViewOrderDetail = (order: Order) => {
    setShowOrderDetail(order);
  };
  
  // Handle product edit
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };
  
  // Handle product save
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, productData);
    } else {
      await onAddProduct(productData);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };
  
  // Apply filters
  const filteredOrders = useFilter(orders, {
    status: orderFilter === 'all' ? undefined : orderFilter,
    search: searchQuery ? {
      $or: [
        { 'customer.name': searchQuery },
        { 'customer.phone': searchQuery },
        { id: searchQuery }
      ]
    } : undefined,
    dateRange: dateRange.from && dateRange.to ? {
      created_at: {
        $gte: new Date(dateRange.from),
        $lte: new Date(dateRange.to)
      }
    } : undefined
  });
  
  const filteredProducts = useFilter(products, {
    status: productFilter === 'all' ? undefined : productFilter,
    search: searchQuery ? { name: searchQuery } : undefined
  });
  
  const filteredCustomers = useFilter(customers, {
    type: customerFilter === 'all' ? undefined : customerFilter,
    search: searchQuery ? {
      $or: [
        { name: searchQuery },
        { email: searchQuery },
        { phone: searchQuery }
      ]
    } : undefined
  });
  
  // Calculate statistics
  const dashboardStats = useMemo(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const recentOrders = orders.filter(o => new Date(o.created_at) > lastMonth);
    const recentRevenue = recentOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total_price, 0);
    
    const activeProducts = products.filter(p => p.status === 'active').length;
    const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;
    
    const loyalCustomers = customers.filter(c => (c.total_orders || 0) > 5).length;
    
    return {
      ...stats,
      recentRevenue,
      activeProducts,
      lowStockProducts,
      loyalCustomers,
      conversionRate: orders.length > 0 ? 
        ((orders.filter(o => o.status === 'completed').length / orders.length) * 100).toFixed(1) + '%' : 
        '0%'
    };
  }, [orders, products, customers, stats]);
  
  // Notification count
  const notificationCount = useMemo(() => {
    return orders.filter(o => o.status === 'pending').length +
           products.filter(p => (p.stock || 0) < 5).length;
  }, [orders, products]);
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 backdrop-blur-xl">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-fadeIn">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Quản trị hệ thống</h2>
            <p className="text-sm text-stone-600">Vui lòng nhập mật khẩu để tiếp tục</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Nhập mật khẩu quản trị..."
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {authError}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Đăng nhập hệ thống
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-xs text-stone-500 text-center">
              © 2024 Thanh Hà Store. Phiên bản 3.0
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Dashboard
  return (
    <div className="fixed inset-0 z-[999] bg-stone-50 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-stone-900">THANH HÀ STORE</h1>
              <p className="text-xs text-stone-500">Admin Dashboard v3.0</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 relative"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 p-4 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-900">Thông báo</h3>
                  <button className="text-xs text-brand-primary hover:underline">
                    Đánh dấu đã đọc
                  </button>
                </div>
                
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'pending').slice(0, 3).map(order => (
                    <div key={order.id} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-stone-900">
                        Đơn hàng #{order.id} cần duyệt
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {order.customer?.name} • {formatCurrency(order.total_price)}
                      </p>
                    </div>
                  ))}
                  
                  {products.filter(p => (p.stock || 0) < 5).slice(0, 2).map(product => (
                    <div key={product.id} className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-stone-900">
                        {product.name} sắp hết hàng
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Còn {product.stock} sản phẩm
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {/* Logout */}
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-stone-200 flex-col py-6">
          <nav className="flex-1 px-4 space-y-1">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3, color: 'text-brand-primary' },
              { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart, color: 'text-blue-600', badge: orders.filter(o => o.status === 'pending').length },
              { id: 'products', label: 'Sản phẩm', icon: Box, color: 'text-green-600', badge: products.filter(p => (p.stock || 0) < 5).length },
              { id: 'customers', label: 'Khách hàng', icon: Users, color: 'text-purple-600' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 text-brand-primary'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          <div className="px-4 pt-6 border-t border-stone-200">
            <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl p-4">
              <p className="text-xs text-stone-600 mb-2">Thống kê hôm nay</p>
              <p className="font-bold text-stone-900 text-lg">
                {formatCurrency(dashboardStats.dailyRevenue || 0)}
              </p>
              <p className="text-xs text-stone-500">{dashboardStats.dailyOrders || 0} đơn hàng</p>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Stats Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Doanh thu hôm nay"
                  value={formatCurrency(dashboardStats.dailyRevenue || 0)}
                  icon={DollarSign}
                  trend="up"
                  percentage="+12.5%"
                  color="brand"
                />
                <StatCard
                  label="Đơn hàng mới"
                  value={dashboardStats.dailyOrders || 0}
                  icon={ShoppingCart}
                  trend="up"
                  percentage="+8.2%"
                  color="green"
                />
                <StatCard
                  label="Khách hàng mới"
                  value={dashboardStats.newCustomers || 0}
                  icon={Users}
                  trend="up"
                  percentage="+5.7%"
                  color="blue"
                />
                <StatCard
                  label="Tỉ lệ chuyển đổi"
                  value={dashboardStats.conversionRate}
                  icon={TrendingUp}
                  trend="up"
                  percentage="+2.3%"
                  color="purple"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-stone-900">Đơn hàng gần đây</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-brand-primary hover:underline font-medium"
                    >
                      Xem tất cả
                    </button>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-stone-900">#{order.id}</span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-sm text-stone-600">{order.customer?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-stone-900">{formatCurrency(order.total_price)}</p>
                          <p className="text-xs text-stone-500">
                            {new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6">
                  <h2 className="text-lg font-bold text-stone-900 mb-6">Tổng quan</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Sản phẩm đang bán</p>
                          <p className="text-xs text-stone-500">{dashboardStats.activeProducts} sản phẩm</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{dashboardStats.activeProducts}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Đơn thành công</p>
                          <p className="text-xs text-stone-500">Tháng này</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {orders.filter(o => o.status === 'completed').length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Sắp hết hàng</p>
                          <p className="text-xs text-stone-500">Cần nhập thêm</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">{dashboardStats.lowStockProducts}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Khách VIP</p>
                          <p className="text-xs text-stone-500">Trên 5 đơn</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{dashboardStats.loyalCustomers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-stone-100 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Status Filter */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setOrderFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === 'all'
                          ? 'bg-brand-primary text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Tất cả
                    </button>
                    {Object.entries(STATUS_META).map(([status, meta]) => (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status as OrderStatus)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          orderFilter === status
                            ? `${meta.bg} ${meta.fg}`
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {meta.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Date Range */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    />
                    <span className="text-stone-400">-</span>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    />
                  </div>
                  
                  {/* Export Button */}
                  <button
                    onClick={() => onExportData('orders')}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Xuất Excel
                  </button>
                </div>
              </div>
              
              {/* Orders Grid */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-stone-400 mb-2">Không có đơn hàng</h3>
                  <p className="text-stone-500">Không tìm thấy đơn hàng nào phù hợp với bộ lọc</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={onUpdateOrderStatus}
                      onDelete={onDeleteOrder}
                      formatCurrency={formatCurrency}
                      onViewDetail={handleViewOrderDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProductFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        productFilter === 'all'
                          ? 'bg-brand-primary text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setProductFilter('active')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        productFilter === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Đang bán
                    </button>
                    <button
                      onClick={() => setProductFilter('inactive')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        productFilter === 'inactive'
                          ? 'bg-red-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Ngừng bán
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onExportData('products')}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Xuất DS
                  </button>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                  </button>
                </div>
              </div>
              
              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                  <Box className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-stone-400 mb-2">Không có sản phẩm</h3>
                  <p className="text-stone-500">Không tìm thấy sản phẩm nào phù hợp với bộ lọc</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={onDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomerFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      customerFilter === 'all'
                        ? 'bg-brand-primary text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setCustomerFilter('vip')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      customerFilter === 'vip'
                        ? 'bg-purple-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Khách VIP
                  </button>
                  <button
                    onClick={() => setCustomerFilter('new')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      customerFilter === 'new'
                        ? 'bg-green-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Khách mới
                  </button>
                </div>
                
                <button
                  onClick={() => onExportData('customers')}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Xuất danh sách
                </button>
              </div>
              
              {/* Customers Grid */}
              {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                  <Users className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-stone-400 mb-2">Không có khách hàng</h3>
                  <p className="text-stone-500">Không tìm thấy khách hàng nào phù hợp với bộ lọc</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCustomers.map(customer => (
                    <CustomerCard key={customer.id} customer={customer} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
