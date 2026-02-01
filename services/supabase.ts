import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const logVisitor = async () => {
  try {
    const { data, error } = await supabase.rpc('increment_page_views');
    if (error) throw error;
    return data;
  } catch {
    console.warn(
      "Supabase Info: Chưa thiết lập RPC increment_page_views"
    );
  }
};
