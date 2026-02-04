// hooks/useCustomers.ts
import { useMemo } from "react";
import { Order, Customer } from "../types";

export const useCustomers = (orders: Order[]) => {
  return useMemo(() => {
    const map = new Map<string, Customer>();

    orders.forEach(o => {
      const c = o.customer;
      if (!c?.phone) return;

      if (!map.has(c.phone)) {
        map.set(c.phone, {
          id: c.phone,
          name: c.name,
          phone: c.phone,
          email: "",
          address: c.address,
          avatar: "",
          total_orders: 1,
          total_spent: o.total_price,
          rating: 5
        });
      } else {
        const cus = map.get(c.phone)!;
        cus.total_orders += 1;
        cus.total_spent += o.total_price;
      }
    });

    return Array.from(map.values());
  }, [orders]);
};
