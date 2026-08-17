import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { loadOrders, saveOrders } from "./store";
import { CreateOrderPayload, Order, OrderStatus } from "./types";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "anbinh2026";
const TABLE_COUNT = Number(process.env.TABLE_COUNT) || 10;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let orders: Order[] = loadOrders();

function persist() {
  saveOrders(orders);
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Health check ----
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, tableCount: TABLE_COUNT });
});

// ---- Tables ----
app.get("/api/tables", (_req, res) => {
  const tables = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);
  res.json({ tables });
});

// ---- Create order (khách gửi món) ----
app.post("/api/orders", (req, res) => {
  const body = req.body as CreateOrderPayload;

  if (!body || typeof body.tableId !== "number" || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: "Thiếu thông tin bàn hoặc món ăn" });
  }
  if (body.tableId < 1 || body.tableId > TABLE_COUNT) {
    return res.status(400).json({ error: "Số bàn không hợp lệ" });
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: genId(),
    tableId: body.tableId,
    items: body.items,
    note: body.note?.trim() || "",
    status: "moi",
    createdAt: now,
    updatedAt: now,
  };

  orders.unshift(order);
  persist();

  io.emit("new-order", order);

  res.status(201).json({ order });
});

// ---- Admin auth middleware ----
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const pass = req.header("x-admin-password");
  if (pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Sai mật khẩu quản lý" });
  }
  next();
}

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Sai mật khẩu" });
});

// ---- List orders (admin) ----
app.get("/api/orders", requireAdmin, (_req, res) => {
  res.json({ orders });
});

// ---- Update order status (admin) ----
app.patch("/api/orders/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: OrderStatus };
  const validStatuses: OrderStatus[] = ["moi", "dang_lam", "xong", "huy"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Không tìm thấy đơn" });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  persist();

  io.emit("order-updated", order);
  io.emit(`order-updated-table-${order.tableId}`, order);

  res.json({ order });
});

// ---- Clear all orders (admin, đầu ngày mới) ----
app.delete("/api/orders", requireAdmin, (_req, res) => {
  orders = [];
  persist();
  io.emit("orders-cleared");
  res.json({ ok: true });
});

io.on("connection", (socket) => {
  socket.on("join-table", (tableId: number) => {
    socket.join(`table-${tableId}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ An Binh menu server đang chạy tại http://localhost:${PORT}`);
});
