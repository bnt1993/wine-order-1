import React from "react";
import ReactDOM from "react-dom/client";
import { AdminApp } from "./Admin/AdminApp";   // Chú ý: 'A' hoa vì thư mục của bạn là Admin/
import "./index.css";

// Debug: in version để chắc chắn chỉ có 1 bản React
console.log("[admin] React version:", React.version);

const container = document.getElementById("admin-root");
if (!container) {
  throw new Error(
    "[Admin] Không tìm thấy #admin-root trong admin.html. Kiểm tra lại admin.html & đường dẫn /admin.tsx."
  );
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
