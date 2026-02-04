// admin/AdminProvider.tsx
import React, { createContext, useContext, useMemo, useCallback } from "react";
import { Order, Product, Customer, DashboardStats, OrderStatus } from "../types";
import { useOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";
import { useCustomers } from "../hooks/useCustomers";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useExport } from "../hooks/useExport";
import { useRealtime } from "../hooks/useRealtime";

type AdminContextType = {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  stats: DashboardStats;
  loading: boolean;
  refreshAll: () => Promise<void>;

  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;

  addProduct: (p: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  exportData: (type: "orders" | "products" | "customers") => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    orders, loading: loadingOrders,
    fetchOrders, updateOrderStatus, deleteOrder
  } = useOrders();

  const {
    products, loading: loadingProducts,
    fetchProducts, addProduct, updateProduct, deleteProduct
  } = useProducts();

  // Tạo customers từ orders JSONB
  const customers = useCustomers(orders);

  // Thống kê dashboard (client-side từ orders/products/customers)
  const stats = useDashboardStats(orders, products, customers);

  // Realtime: khi có thay đổi (orders / products) → reload
  useRealtime(["orders", "products"], async () => {
    await Promise.all([fetchOrders(), fetchProducts()]);
  });

  const loading = loadingOrders || loadingProducts;

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchOrders(), fetchProducts()]);
  }, [fetchOrders, fetchProducts]);

  // Export CSV
  const { exportOrders, exportProducts, exportCustomers } = useExport();
  const exportData = (type: "orders" | "products" | "customers") => {
    if (type === "orders") exportOrders(orders);
    if (type === "products") exportProducts(products);
    if (type === "customers") exportCustomers(customers);
  };

  const value = useMemo<AdminContextType>(() => ({
    orders, products, customers, stats, loading,
    refreshAll,
    updateOrderStatus, deleteOrder,
    addProduct, updateProduct, deleteProduct,
    exportData
  }), [
    orders, products, customers, stats, loading,
    refreshAll,
    updateOrderStatus, deleteOrder,
    addProduct, updateProduct, deleteProduct
  ]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider/>");
  return ctx;
};
``
