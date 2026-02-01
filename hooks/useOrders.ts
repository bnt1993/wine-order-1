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
          id: order.id,
          customer: order.customer,
          items: order.items,
          total_price: order.totalPrice,        // ✅ snake_case
          payment_method: order.paymentMethod, // ✅ snake_case
          status: order.status,
          created_at: order.created_at
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
