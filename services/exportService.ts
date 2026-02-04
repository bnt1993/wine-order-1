// services/exportService.ts
import { Order, Product, Customer } from "../types";

type Cell = string | number | null | undefined;
const esc = (v: Cell) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCSV = (rows: string[][], filename: string) => {
  const csv = "\uFEFF" + rows.map(r => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportOrdersCSV = (orders: Order[]) => {
  const headers = ["Mã đơn","Ngày tạo","Trạng thái","Phương thức","Khách hàng","SĐT","Địa chỉ","Số lượng","Chi tiết","Tổng tiền"];
  const rows = orders.map(o => {
    const items = o.items || [];
    const qty = items.reduce((s: number, it: any) => s + (it.quantity || 0), 0);
    return [
      String(o.id),
      new Date(o.created_at).toLocaleString("vi-VN", { hour12: false }),
      o.status,
      o.payment_method || "",
      o.customer?.name || "",
      o.customer?.phone || "",
      o.customer?.address || "",
      String(qty),
      items.map((i: any) => `${i.name} x${i.quantity}`).join(" | "),
      String(o.total_price),
    ];
  });
  downloadCSV([headers, ...rows], "orders");
};

export const exportProductsCSV = (products: Product[]) => {
  const headers = ["ID","Tên","Danh mục","Giá","Mô tả","Xuất xứ","Thể tích","Độ cồn","Thời gian ủ","Ảnh"];
  const rows = products.map(p => [
    p.id, p.name, p.category, String(p.price), p.description || "",
    p.origin || "", p.volume || "", p.alcohol_content || "", p.aging_time || "", p.image || ""
  ]);
  downloadCSV([headers, ...rows], "products");
};

export const exportCustomersCSV = (customers: Customer[]) => {
  const headers = ["ID","Tên","SĐT","Email","Địa chỉ","Tổng đơn","Tổng chi"];
  const rows = customers.map(c => [
    c.id, c.name, c.phone, c.email || "", c.address || "", String(c.total_orders || 0), String(c.total_spent || 0)
  ]);
  downloadCSV([headers, ...rows], "customers");
};
