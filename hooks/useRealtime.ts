// hooks/useRealtime.ts
import { useEffect } from "react";
import { supabase } from "../services/supabase";

/**
 * Subscribe realtime cho nhiều bảng.
 * Khi có thay đổi bất kỳ (INSERT/UPDATE/DELETE) → gọi onChange()
 */
export const useRealtime = (
  tables: Array<"orders" | "products">,
  onChange: () => void
) => {
  useEffect(() => {
    // 1 channel dùng chung cho nhiều bảng
    const channel = supabase.channel("admin-realtime");

    tables.forEach((t) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: t },
        () => onChange()
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // Dùng join(",") để tránh re-subscribe liên tục do mảng tham chiếu thay đổi
  }, [tables.join(","), onChange]);
};
