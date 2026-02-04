// admin/AdminApp.tsx
import React from "react";
import AdminDashboard from "../components/AdminDashboard";
import { AdminProvider, useAdmin } from "./AdminProvider";

const AdminShell = () => {
  const {
    orders, products, customers, stats,
    updateOrderStatus, deleteOrder,
    addProduct, updateProduct, deleteProduct,
    exportData, refreshAll,
    loading
  } = useAdmin();

  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <AdminDashboard
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      orders={orders}
      products={products}
      customers={customers}
      stats={stats}
      onUpdateOrderStatus={updateOrderStatus}
      onDeleteOrder={deleteOrder}
      onAddProduct={addProduct}
      onUpdateProduct={updateProduct}
      onDeleteProduct={deleteProduct}
      onExportData={exportData}
      onRefreshData={refreshAll}
      // Lưu ý: AdminDashboard của bạn có UI login sẵn.
    />
  );
};

export const AdminApp = () => (
  <AdminProvider>
    <AdminShell />
  </AdminProvider>
);