// admin.tsx — Entry riêng cho Admin Panel (nằm ngoài /src)

// React
import React from "react";
import ReactDOM from "react-dom/client";

// Import vào từ src/
import { AdminDashboardPremium } from "./src/components/admin/AdminDashboardPremium";
import { useOrders } from "./src/hooks/useOrders";
import { useProducts } from "./src/hooks/useProducts";

// CSS global (nằm trong src)
import "./src/index.css";

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

// Mount vào admin.html
ReactDOM.createRoot(document.getElementById("admin")!).render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);
