// admin.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AdminApp } from "./admin/AdminApp";
import "./index.css";

ReactDOM.createRoot(document.getElementById("admin")!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
