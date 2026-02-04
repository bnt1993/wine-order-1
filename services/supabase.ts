// services/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase ENV không tồn tại. Kiểm tra .env / .env.local");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Optional: RPC page views
export const logVisitor = async () => {
  try {
    const { data, error } = await supabase.rpc("increment_page_views");
    if (error) {
      console.warn("⚠️ RPC increment_page_views lỗi:", error.message);
      return null;
    }
    return data;
  } catch {
    console.warn("⚠️ Chưa cấu hình RPC increment_page_views trong Supabase");
    return null;
  }
};
