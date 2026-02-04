// services/productsService.ts
import { supabase } from "./supabase";
import { Product } from "../types";

export async function fetchProductsService(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price || 0),
    image: row.image || "",
    description: row.description || "",
    benefits: row.benefits || null,
    badges: row.badges || null,
    origin: row.origin || "",
    volume: row.volume || "",
    alcohol_content: row.alcohol_content || "",
    aging_time: row.aging_time || "",
    created_at: row.created_at,
    stock: (row.stock as number) ?? 0,
    status: (row.status as any) ?? "active"
  }));
}

export async function addProductService(p: Partial<Product>) {
  const payload = {
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image ?? null,
    description: p.description ?? null,
    benefits: p.benefits ?? null,
    badges: p.badges ?? null,
    origin: p.origin ?? null,
    volume: p.volume ?? null,
    alcohol_content: p.alcohol_content ?? null,
    aging_time: p.aging_time ?? null
  };
  const { error } = await supabase.from("products").insert([payload]);
  if (error) throw error;
}

export async function updateProductService(id: string, p: Partial<Product>) {
  const { error } = await supabase.from("products").update(p).eq("id", id);
  if (error) throw error;
}

export async function deleteProductService(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
