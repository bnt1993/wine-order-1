import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { supabase } from '../services/supabase';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }); // ✅ đúng tên cột

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Supabase fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (order: Order) => {
    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer: order.customer,
          items: order.items,
          total_price: order.total_price,        // ✅ snake_case
          payment_method: order.payment_method, // ✅ snake_case
          status: order.status,
        }
      ]);

      if (error) throw error;

      setOrders(prev => [order, ...prev]);
    } catch (err) {
      console.error("Supabase insert error:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
    } catch (err) {
      console.error("Supabase update error:", err);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Supabase delete error:", err);
    }
  };

  return { 
    orders, 
    loading, 
    fetchOrders, 
    createOrder, 
    updateOrderStatus, 
    deleteOrder 
  };
};
