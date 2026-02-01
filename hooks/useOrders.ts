
import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { supabase } from '../services/supabase';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Supabase: Lỗi khi lấy dữ liệu đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (order: Order) => {
    if (!supabase) {
      console.warn("Supabase: Chưa được cấu hình. Đơn hàng chỉ được lưu vào bộ nhớ tạm.");
      setOrders(prev => [order, ...prev]);
      return;
    }
    try {
      const { error } = await supabase.from('orders').insert([
        {
          id: order.id,
          customer: order.customer,
          items: order.items,
          totalPrice: order.totalPrice,
          paymentMethod: order.paymentMethod,
          status: order.status,
          createdAt: order.createdAt
        }
      ]);
      if (error) throw error;
      setOrders(prev => [order, ...prev]);
    } catch (err) {
      console.error("Supabase: Lỗi khi tạo đơn hàng:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      return;
    }
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error("Supabase: Lỗi khi cập nhật trạng thái đơn hàng:", err);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!supabase) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      return;
    }
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Supabase: Lỗi khi xóa đơn hàng:", err);
    }
  };

  return { orders, loading, fetchOrders, createOrder, updateOrderStatus, deleteOrder };
};
