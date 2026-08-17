import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../lib/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import "./AdminLogin.css";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin(password);
      if (res.ok) {
        login(password);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sai mật khẩu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ab-adminlogin">
      <form className="ab-adminlogin__card" onSubmit={handleSubmit}>
        <span className="ab-adminlogin__eyebrow">Trang Bếp / Quản lý</span>
        <h1>Vườn Sinh Thái An Bình</h1>
        <p>Đăng nhập để xem đơn khách vừa gọi món, nghe chuông báo đơn mới và in mã QR cho từng bàn.</p>
        <input
          type="password"
          placeholder="Mật khẩu quản lý"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="ab-adminlogin__error">{error}</p>}
        <button type="submit" disabled={loading || !password}>
          {loading ? "Đang kiểm tra..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
