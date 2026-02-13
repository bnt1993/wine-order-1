import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext
} from "react";
import { supabase } from "../services/supabase";
import { Order, Product, Customer, OrderStatus } from "../types";

/* =========================
   TYPES
========================= */

type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
};

type AdminContextType = {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  stats: DashboardStats;
  loading: boolean;

  refreshAll: () => Promise<void>;

  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  addProduct: (p: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | null>(null);

/* =========================
   PROVIDER
========================= */

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH FUNCTIONS
  ========================= */

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Orders] fetch error:", error);
      return;
    }

    setOrders(
      (data ?? []).map((row: any) => ({
        id: String(row.id),
        created_at: row.created_at,
        status: row.status,
        payment_method: row.payment_method,
        total_price: Number(row.total_price),
        customer: row.customer,
        items: row.items
      }))
    );
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Products] fetch error:", error);
      return;
    }

    setProducts(
      (data ?? []).map((row: any) => ({
        id: String(row.id),
        name: row.name,
        category: row.category,
        price: Number(row.price),
        image: row.image,
        description: row.description,
        created_at: row.created_at
      }))
    );
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchProducts()]);
    setLoading(false);
  }, [fetchOrders, fetchProducts]);

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  /* =========================
     REALTIME (NO LOOP)
  ========================= */

  useEffect(() => {
    const channel = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        refreshAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        refreshAll
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAll]);

  /* =========================
     CUSTOMERS (DERIVED)
  ========================= */

  const customers: Customer[] = useMemo(() => {
    const map = new Map<string, Customer>();

    orders.forEach(o => {
      if (!o.customer?.email) return;

      map.set(o.customer.email, {
        name: o.customer.name,
        email: o.customer.email,
        phone: o.customer.phone
      });
    });

    return Array.from(map.values());
  }, [orders]);

  /* =========================
     STATS (SAFE)
  ========================= */

  const stats: DashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.total_price || 0),
      0
    );

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: customers.length
    };
  }, [orders, products, customers]);

  /* =========================
     ORDER ACTIONS
  ========================= */

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      const prev = orders;

      setOrders(current =>
        current.map(o => (o.id === id ? { ...o, status } : o))
      );

      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("[Orders] update error:", error);
        setOrders(prev);
      }
    },
    [orders]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      const prev = orders;
      setOrders(current => current.filter(o => o.id !== id));

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Orders] delete error:", error);
        setOrders(prev);
      }
    },
    [orders]
  );

  /* =========================
     PRODUCT ACTIONS
  ========================= */

  const addProduct = useCallback(
    async (p: Partial<Product>) => {
      const { error } = await supabase.from("products").insert([p]);
      if (error) console.error("[Products] add error:", error);
    },
    []
  );

  const updateProduct = useCallback(
    async (id: string, p: Partial<Product>) => {
      const { error } = await supabase
        .from("products")
        .update(p)
        .eq("id", id);

      if (error) console.error("[Products] update error:", error);
    },
    []
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) console.error("[Products] delete error:", error);
    },
    []
  );

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = useMemo(
    () => ({
      orders,
      products,
      customers,
      stats,
      loading,
      refreshAll,
      updateOrderStatus,
      deleteOrder,
      addProduct,
      updateProduct,
      deleteProduct
    }),
    [
      orders,
      products,
      customers,
      stats,
      loading,
      refreshAll,
      updateOrderStatus,
      deleteOrder,
      addProduct,
      updateProduct,
      deleteProduct
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

/* =========================
   HOOK
========================= */

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
};
