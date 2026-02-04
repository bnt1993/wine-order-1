// src/admin.tsx
import React from "react";
import ReactDOM from "react-dom/client";

// Dashboard giao diện Premium
import { AdminDashboardPremium } from "./components/admin/AdminDashboardPremium";

// Hooks Supabase
import { useOrders } from "./hooks/useOrders";
import { useProducts } from "./hooks/useProducts";

// CSS
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

  // Khi admin mở dashboard -> load lại dữ liệu
  React.useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  return (
    <AdminDashboardPremium
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      orders={orders}
      updateStatus={updateOrderStatus}
      deleteOrder={deleteOrder}
      products={products}
      setProducts={() => {}}
      deleteProduct={deleteProduct}
      loading={loadingOrders || loadingProducts}
    />
  );
};

ReactDOM.createRoot(document.getElementById("admin")!).render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);
