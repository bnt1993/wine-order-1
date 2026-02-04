// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Product } from "../types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(
        (data || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          price: Number(row.price),
          image: row.image,
          description: row.description,
          benefits: row.benefits,
          badges: row.badges,
          origin: row.origin,
          volume: row.volume,
          alcohol_content: row.alcohol_content,
          aging_time: row.aging_time,
          created_at: row.created_at,
          stock: 0,        // bạn không có cột stock → set mặc định
          status: "active" // bạn không có status → set mặc định
        }))
      );
    } catch (err) {
      console.error("[Products] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    const prev = products;
    setProducts(p => p.filter(x => x.id !== id));

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("[Products] delete error:", err);
      setProducts(prev);
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    deleteProduct
  };
};
