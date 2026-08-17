import { createContext, useContext, useState, ReactNode } from "react";

interface AdminAuthValue {
  password: string | null;
  login: (password: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "an-binh-admin-password";

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY)
  );

  function login(pw: string) {
    sessionStorage.setItem(STORAGE_KEY, pw);
    setPassword(pw);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword(null);
  }

  return (
    <AdminAuthContext.Provider value={{ password, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth phải dùng trong AdminAuthProvider");
  return ctx;
}
