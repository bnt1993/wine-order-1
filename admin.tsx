// admin.tsx — entry cho trang Admin (nằm ngoài /components)

import React from "react";
import ReactDOM from "react-dom/client";
import { AdminApp } from "./admin/AdminApp";       // dùng AdminApp mới
import "./index.css";

ReactDOM.createRoot(document.getElementById("admin")!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
