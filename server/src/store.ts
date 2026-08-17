import fs from "fs";
import path from "path";
import { Order } from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function loadOrders(): Order[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
}
