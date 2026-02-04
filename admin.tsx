// admin.tsx — Entry riêng cho Admin Panel (nằm ngoài /components, /hooks,...)

// React
import React from "react";
import ReactDOM from "react-dom/client";

// Import đúng theo cấu trúc của bạn
import { AdminDashboard } from "./components/AdminDashboard";
import { useOrders } from "./hooks/useOrders";
import { useProducts } from "./hooks/useProducts";

// CSS global
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
      setProducts={() => {}}
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
