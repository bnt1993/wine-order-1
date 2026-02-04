// services/ordersService.ts
import { supabase } from "./supabase";
import { Order, OrderStatus } from "../types";

export async function fetchOrdersService(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    created_at: row.created_at,
    status: row.status,
    payment_method: row.payment_method || "",
    total_price: Number(row.total_price || 0),
    customer: row.customer,
    items: row.items,
    note: row.note || ""
  }));
}

export async function updateOrderStatusService(id: number, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrderService(id: number) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}
