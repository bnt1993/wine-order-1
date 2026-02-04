// hooks/useAdminAuth.ts
import { useState } from "react";

export const useAdminAuth = () => {
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Buingoctay93$";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      return true;
    }
    setError("Mật khẩu không chính xác");
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return { isAuthenticated, error, login, logout };
};
