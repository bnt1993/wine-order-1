// hooks/useOrders.ts
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Order, OrderStatus } from "../types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(
        (data || []).map((row: any) => ({
          id: row.id,
          created_at: row.created_at,
          status: row.status,
          payment_method: row.payment_method,
          total_price: Number(row.total_price),
          customer: row.customer,   // JSONB
          items: row.items          // JSONB
        }))
      );
    } catch (err) {
      console.error("[Orders] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE STATUS
  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    const prev = orders;
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("[Orders] update error:", err);
      setOrders(prev);
    }
  };

  // DELETE ORDER
  const deleteOrder = async (id: number) => {
    const prev = orders;
    setOrders(prev => prev.filter(o => o.id !== id));
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("[Orders] delete error:", err);
      setOrders(prev);
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
  };
};
