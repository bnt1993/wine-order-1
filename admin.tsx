// admin.tsx — chạy admin.html

import React from "react";
import ReactDOM from "react-dom/client";

// Bạn không hề có thư mục /components/admin/
// Bạn có sẵn file: /components/AdminDashboard.tsx
import AdminDashboard from "./components/AdminDashboard";

// Hooks dữ liệu Supabase đang nằm trong /hooks/
import { useOrders } from "./hooks/useOrders";
import { useProducts } from "./hooks/useProducts";

// Global CSS
import "./index.css";

const AppAdmin = () => {
  const {
    orders,
    loading: loadingOrders,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  } = useOrders();

  const {
    products,
    loading: loadingProducts,
    fetchProducts,
    deleteProduct,
  } = useProducts();

  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  return (
    <AdminDashboard
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      orders={orders}
      updateStatus={updateOrderStatus}
      deleteOrder={deleteOrder}
      products={products}
      deleteProduct={deleteProduct}
      loading={loadingOrders || loadingProducts}
    />
  );
};

// Mount vào admin.html
ReactDOM.createRoot(document.getElementById("admin")!).render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);
