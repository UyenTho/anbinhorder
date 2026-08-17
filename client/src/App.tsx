import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CustomerMenu } from "./pages/CustomerMenu";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminQrCodes } from "./pages/AdminQrCodes";
import { AdminAuthProvider } from "./context/AdminAuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<CustomerMenu />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/qrcodes" element={<AdminQrCodes />} />
          {/* /kitchen là đường dẫn thân thiện dùng chung cho nhân viên bếp,
              trỏ tới cùng trang quản lý (đăng nhập rồi vào thẳng bảng đơn) */}
          <Route path="/kitchen" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
