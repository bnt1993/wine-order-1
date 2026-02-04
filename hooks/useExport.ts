// hooks/useExport.ts
import { Order, Product, Customer } from "../types";
import { exportOrdersCSV, exportProductsCSV, exportCustomersCSV } from "../services/exportService";

export const useExport = () => {
  const exportOrders = (orders: Order[]) => exportOrdersCSV(orders);
  const exportProducts = (products: Product[]) => exportProductsCSV(products);
  const exportCustomers = (customers: Customer[]) => exportCustomersCSV(customers);
  return { exportOrders, exportProducts, exportCustomers };
};
