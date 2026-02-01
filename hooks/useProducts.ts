
import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';
import { supabase } from '../services/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!supabase) {
      console.warn("Supabase: Chưa được cấu hình. Sử dụng dữ liệu sản phẩm mẫu.");
      setProducts(INITIAL_PRODUCTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Nếu database trống, hiển thị dữ liệu mặc định
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (err) {
      console.error("Supabase: Lỗi khi lấy dữ liệu sản phẩm:", err);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Product) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').insert([product]);
      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      console.error("Supabase: Lỗi khi thêm sản phẩm:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!supabase) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      console.error("Supabase: Lỗi khi xóa sản phẩm:", err);
    }
  };

  return { products, setProducts, loading, fetchProducts, addProduct, deleteProduct };
};
