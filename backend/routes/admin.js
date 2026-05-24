import express from "express";
import { pool } from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";
import { rolesMiddleware } from "../middleware/roles.js";

const router = express.Router();

router.get(
  "/clients",
  authMiddleware,
  rolesMiddleware("admin"),
  async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, phone, email, date_birth
         FROM users
         WHERE role = 'client'
         ORDER BY id ASC`
      );

      const clients = rows.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone ?? "",
        email: row.email,
        date_birth:
          row.date_birth instanceof Date
            ? row.date_birth.toISOString().slice(0, 10)
            : String(row.date_birth || "").slice(0, 10),
      }));

      res.json({ clients });
    } catch (err) {
      res.status(500).json({ error: "Ошибка загрузки списка клиентов" });
    }
  }
);

function formatTimeValue(t) {
  if (t == null) return "";
  if (typeof t === "string") {
    const s = t.trim();
    if (s.length >= 5 && s[2] === ":") return s.slice(0, 5);
    return s.slice(0, 5);
  }
  if (t instanceof Date && !Number.isNaN(t.getTime())) {
    return t.toISOString().slice(11, 16);
  }
  return String(t).slice(0, 5);
}

function formatDateValue(d) {
  if (!d) return "";
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d)) {
    return d.slice(0, 10);
  }
  if (d instanceof Date && !Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return String(d).slice(0, 10);
}

router.get(
  "/reservations",
  authMiddleware,
  rolesMiddleware("admin"),
  async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT id, user_id, name, phone, email, date, time, guests_count, status, comment, created_at
         FROM reservations
         ORDER BY date DESC, time DESC, id DESC`
      );

      const reservations = rows.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        phone: row.phone ?? "",
        email: row.email,
        date: formatDateValue(row.date),
        time: formatTimeValue(row.time),
        guests_count: row.guests_count,
        status: row.status,
        comment: row.comment ? String(row.comment) : "",
        created_at:
          row.created_at instanceof Date
            ? row.created_at.toISOString()
            : row.created_at || null,
      }));

      res.json({ reservations });
    } catch {
      res.status(500).json({ error: "Ошибка загрузки заявок на бронь" });
    }
  }
);

const ORDER_STATUSES = ["new", "confirmed", "cooking", "delivered", "completed", "cancelled"];

function formatOrderDisplayNumber(id) {
  return String(100000000 + Number(id)).slice(1);
}

function parseCheckoutSnapshot(raw) {
  let snapshot = raw;
  if (typeof snapshot === "string") {
    try {
      snapshot = JSON.parse(snapshot);
    } catch {
      snapshot = null;
    }
  }
  return snapshot;
}

async function loadOrderById(orderId) {
  const [orders] = await pool.query(
    `SELECT o.id, o.status, o.delivery_type, o.payment_method, o.total_price, o.delivery_address,
            o.comment, o.checkout_snapshot, o.delivery_datetime, o.created_at
     FROM orders o
     WHERE o.id = ?`,
    [orderId]
  );
  if (orders.length === 0) return null;

  const order = orders[0];
  const [items] = await pool.query(
    `SELECT oi.id, oi.quantity, oi.price, m.name AS title, m.weight, c.name AS category_name
     FROM order_items oi
     JOIN menu_items m ON m.id = oi.menu_item_id
     LEFT JOIN categories c ON c.id = m.category_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [order.id]
  );

  return {
    id: order.id,
    displayNumber: formatOrderDisplayNumber(order.id),
    status: order.status,
    delivery_type: order.delivery_type,
    payment_method: order.payment_method,
    total_price: order.total_price,
    delivery_address: order.delivery_address,
    comment: order.comment,
    snapshot: parseCheckoutSnapshot(order.checkout_snapshot),
    delivery_datetime:
      order.delivery_datetime instanceof Date
        ? order.delivery_datetime.toISOString()
        : order.delivery_datetime,
    created_at:
      order.created_at instanceof Date ? order.created_at.toISOString() : order.created_at,
    items,
  };
}

router.get(
  "/orders",
  authMiddleware,
  rolesMiddleware("admin"),
  async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT o.id, o.user_id, o.status, o.delivery_type, o.total_price, o.created_at,
                u.name AS client_name
         FROM orders o
         JOIN users u ON u.id = o.user_id
         ORDER BY o.created_at DESC, o.id DESC`
      );

      const orders = rows.map((row) => ({
        id: row.id,
        displayNumber: formatOrderDisplayNumber(row.id),
        client_name: row.client_name || "–",
        status: row.status,
        delivery_type: row.delivery_type,
        total_price: row.total_price,
        created_at:
          row.created_at instanceof Date
            ? row.created_at.toISOString()
            : row.created_at || null,
      }));

      res.json({ orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Ошибка загрузки заказов" });
    }
  }
);

router.get(
  "/orders/:id",
  authMiddleware,
  rolesMiddleware("admin"),
  async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({ error: "Некорректный номер заказа" });
      }

      const order = await loadOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Заказ не найден" });
      }

      return res.json({ order });
    } catch (err) {
      console.error(err);
      if (
        String(err.message || "").includes("Unknown column") &&
        String(err.message || "").includes("checkout_snapshot")
      ) {
        return res.status(500).json({
          error:
            "В базе не применена миграция: выполните backend/migrations/20260512_orders_checkout_snapshot.sql",
        });
      }
      return res.status(500).json({ error: "Не удалось загрузить заказ" });
    }
  }
);

router.patch(
  "/orders/:id",
  authMiddleware,
  rolesMiddleware("admin"),
  async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({ error: "Некорректный номер заказа" });
      }

      const status = String(req.body?.status || "").trim();
      if (!ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ error: "Некорректный статус" });
      }

      const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Заказ не найден" });
      }

      res.json({ ok: true, id: orderId, status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Не удалось обновить статус" });
    }
  }
);

export default router;
