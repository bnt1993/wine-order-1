// admin.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AdminApp } from "./Admin/AdminApp";
import "./index.css";

const container = document.getElementById("admin");
if (!container) {
  // Log rõ ràng giúp chẩn đoán production
  // Có thể dùng alert nếu bạn muốn biết ngay trên Vercel
  throw new Error(
    "[Admin] Không tìm thấy #admin trong admin.html. Kiểm tra admin.html và đường dẫn <script type='module' src='/admin.tsx'>"
  );
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
