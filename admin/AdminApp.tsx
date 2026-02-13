import React from "react";
import { AdminProvider, useAdmin } from "./useAdminEnterprise";
import AdminDashboard from "../components/AdminDashboard";

const AdminShell = () => {
  const admin = useAdmin();

  return (
    <AdminDashboard
      orders={admin.orders}
      products={admin.products}
      customers={admin.customers}
      stats={admin.stats}
      loading={admin.loading}
      onRefresh={admin.refreshAll}
      onUpdateOrderStatus={admin.updateOrderStatus}
      onDeleteOrder={admin.deleteOrder}
      onAddProduct={admin.addProduct}
      onUpdateProduct={admin.updateProduct}
      onDeleteProduct={admin.deleteProduct}
    />
  );
};

export const AdminApp = () => {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
};
