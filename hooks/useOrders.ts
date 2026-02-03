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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (err) {
      console.error('[Orders] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (order: Order) => {
    try {
      // Nếu bạn tự sinh id phía client thì có thể đẩy thẳng,
      // còn nếu dùng default uuid của DB thì có thể bỏ id ở đây.
      const { error } = await supabase.from('orders').insert([
        {
          customer: order.customer,
          items: order.items,
          total_price: order.total_price,
          payment_method: order.payment_method, // snake_case
          status: order.status,
        }
      ]);
      if (error) throw error;

      // Tùy bạn: fetch lại hoặc thêm vào đầu danh sách:
      // fetchOrders();
      setOrders(prev => [order, ...prev]);
    } catch (err) {
      console.error('[Orders] insert error:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic update
    const prevOrders = orders;
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      // OK: giữ state như hiện tại
    } catch (err) {
      console.error('[Orders] update error:', err);
      // Rollback khi lỗi
      setOrders(prevOrders);
    }
  };

  const deleteOrder = async (orderId: string) => {
    // Optimistic update
    const prevOrders = orders;
    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
    } catch (err) {
      console.error('[Orders] delete error:', err);
      // Rollback khi lỗi
      setOrders(prevOrders);
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  };
};
``
