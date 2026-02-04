// hooks/useRealtime.ts
import { useEffect } from "react";
import { supabase } from "../services/supabase";

export const useRealtime = (
  tables: Array<"orders" | "products">,
  onChange: () => void
) => {
  useEffect(() => {
    const channel = supabase.channel("admin-realtime");
    tables.forEach((t) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: t },
        () => onChange()
      );
    });
    channel.subscribe();
    return () => supabase.removeChannel(channel);
  }, [tables.join(","), onChange]);
};
