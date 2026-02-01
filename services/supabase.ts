
import { createClient } from '@supabase/supabase-js';

// Thông tin kết nối Supabase của bạn đã được cấu hình trực tiếp
const supabaseUrl = 'https://jvgjduxitygmcjgqanyn.supabase.co';
const supabaseAnonKey = 'sb_publishable_zhn-0p6OOK3JVns04qKnLQ_6GtqVrJf';

// Khởi tạo client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Ghi nhận lượt truy cập trang web.
 * Yêu cầu một hàm RPC tên 'increment_page_views' trong Supabase database.
 */
export const logVisitor = async () => {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.rpc('increment_page_views');
    if (error) throw error;
    return data;
  } catch (err) {
    // Không hiển thị lỗi ra console người dùng để tránh gây hoang mang, 
    // chỉ ghi nhận cảnh báo nếu hàm RPC chưa được thiết lập.
    console.warn("Supabase Info: Hệ thống đang chờ thiết lập hàm 'increment_page_views' để đếm lượt truy cập.");
  }
};
