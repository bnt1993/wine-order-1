// services/customersService.ts
import { Customer, Order } from "../types";

export function buildCustomersFromOrders(orders: Order[]): Customer[] {
  const map = new Map<string, Customer>();
  for (const o of orders) {
    const c = o.customer;
    if (!c?.phone) continue;
    if (!map.has(c.phone)) {
      map.set(c.phone, {
        id: c.phone,
        name: c.name || "",
        phone: c.phone,
        email: "",
        address: c.address || "",
        avatar: "",
        total_orders: 1,
        total_spent: o.total_price,
        rating: 5
      });
    } else {
      const m = map.get(c.phone)!;
      m.total_orders += 1;
      m.total_spent += o.total_price;
    }
  }
  return Array.from(map.values());
}
