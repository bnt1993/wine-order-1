
import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';
import { useOrders } from './hooks/useOrders';
import { useProducts } from './hooks/useProducts';

const AdminPage = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { products, setProducts, deleteProduct } = useProducts();

  return (
    <div className="min-h-screen">
      <AdminDashboard 
        isOpen={true} 
        onClose={() => window.location.href = 'index.html'} 
        orders={orders} 
        updateStatus={updateOrderStatus} 
        deleteOrder={deleteOrder}
        products={products}
        setProducts={setProducts}
      />
    </div>
  );
};

const rootElement = document.getElementById('admin-root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AdminPage />
    </React.StrictMode>
  );
}
