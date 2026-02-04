// hooks/useDashboardStats.ts
import { useMemo } from "react";
import { Order, Product, Customer, DashboardStats } from "../types";

export const useDashboardStats = (
  orders: Order[],
  products: Product[],
  customers: Customer[]
) => {
  return useMemo<DashboardStats>(() => {
    const today = new Date();
    const isSameDay = (d: Date) =>
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    let dailyRevenue = 0;
    let dailyOrders = 0;

    const completed = orders.filter(o => o.status === "completed");
    for (const o of orders) {
      const dt = new Date(o.created_at);
      if (isSameDay(dt)) {
        dailyOrders++;
        if (o.status === "completed") dailyRevenue += o.total_price;
      }
    }

    // newCustomers: unique phones có đơn trong hôm nay
    const newCusSet = new Set(
      orders
        .filter(o => isSameDay(new Date(o.created_at)) && o.customer?.phone)
        .map(o => o.customer!.phone)
    );

    const conversionRate =
      orders.length > 0
        ? `${((completed.length / orders.length) * 100).toFixed(1)}%`
        : "0%";

    return {
      dailyRevenue,
      dailyOrders,
      newCustomers: newCusSet.size,
      conversionRate
    };
  }, [orders, products, customers]);
};
