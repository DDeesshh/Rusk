import express from "express";
import { pool } from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateOrderSlot } from "../lib/orderHours.js";

const router = express.Router();

router.use(authMiddleware);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;

function requireClient(req, res) {
  if (req.user.role !== "client") {
    res.status(403).json({ error: "Доступно только клиентам" });
    return false;
  }
  return true;
}

function formatDisplayOrderNumber(id) {
  return String(100000000 + Number(id)).slice(1);
}

function buildDeliveryAddressLine(body) {
  const parts = [
    body.city,
    body.street,
    body.house ? `д. ${body.house}` : "",
    body.apartment ? `кв./оф. ${body.apartment}` : "",
    body.entrance ? `подъезд ${body.entrance}` : "",
    body.floor ? `эт. ${body.floor}` : "",
    body.intercom ? `домофон ${body.intercom}` : "",
  ].filter(Boolean);
  const s = parts.join(", ");
  return s.length > 255 ? `${s.slice(0, 252)}...` : s;
}

router.post("/", async (req, res) => {
  if (!requireClient(req, res)) return;

  try {
    const {
      delivery_type: deliveryTypeRaw,
      payment_method: paymentMethodRaw,
      name,
      phone,
      email,
      date,
      time,
      comment = "",
      city = "",
      street = "",
      house = "",
      apartment = "",
      entrance = "",
      floor = "",
      intercom = "",
      items = [],
    } = req.body;

    const deliveryType = deliveryTypeRaw === "delivery" ? "delivery" : "pickup";
    const paymentMethod = paymentMethodRaw === "cash" ? "cash" : "card";

    const normalizedName = String(name || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedComment = String(comment || "").trim();

    if (!normalizedName || normalizedName.length < 2) {
      return res.status(400).json({ error: "Укажите имя" });
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ error: "Телефон в формате +79991234567" });
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: "Некорректный email" });
    }

    if (deliveryType === "delivery") {
      const reqAddr = [city, street, house, apartment, entrance, floor, intercom].map((x) =>
        String(x || "").trim()
      );
      if (reqAddr.some((x) => !x)) {
        return res.status(400).json({ error: "Заполните все поля адреса доставки" });
      }
    }

    const slotError = validateOrderSlot(String(date || ""), String(time || ""), deliveryType);
    if (slotError) {
      return res.status(400).json({ error: slotError });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Корзина пуста" });
    }

    const deliveryDatetime = `${String(date).trim()} ${String(time).trim()}:00`;
    const deliveryAddress =
      deliveryType === "delivery" ? buildDeliveryAddressLine({ city, street, house, apartment, entrance, floor, intercom }) : null;

    const snapshot = {
      name: normalizedName,
      phone: normalizedPhone,
      email: normalizedEmail,
      city: String(city || "").trim(),
      street: String(street || "").trim(),
      house: String(house || "").trim(),
      apartment: String(apartment || "").trim(),
      entrance: String(entrance || "").trim(),
      floor: String(floor || "").trim(),
      intercom: String(intercom || "").trim(),
      comment: normalizedComment,
    };

    const menuIds = items.map((r) => Number(r.menuItemId)).filter((id) => Number.isInteger(id) && id > 0);
    if (menuIds.length !== items.length) {
      return res.status(400).json({ error: "Некорректные позиции заказа" });
    }

    const uniqueIds = [...new Set(menuIds)];
    const [menuRows] = await pool.query(
      `SELECT id, price FROM menu_items WHERE id IN (${uniqueIds.map(() => "?").join(",")})`,
      uniqueIds
    );
    if (menuRows.length !== uniqueIds.length) {
      return res.status(400).json({ error: "Некоторые блюда недоступны" });
    }

    const priceById = new Map(menuRows.map((r) => [r.id, Number(r.price)]));

    const qtyByMenuId = new Map();
    for (const row of items) {
      const id = Number(row.menuItemId);
      const qty = Number(row.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
        return res.status(400).json({ error: "Некорректное количество" });
      }
      qtyByMenuId.set(id, (qtyByMenuId.get(id) || 0) + qty);
    }

    let total = 0;
    const lines = [];
    for (const [id, qty] of qtyByMenuId) {
      const unit = priceById.get(id);
      if (unit == null || !Number.isFinite(unit)) {
        return res.status(400).json({ error: "Ошибка цены позиции" });
      }
      total += unit * qty;
      lines.push({ menu_item_id: id, quantity: qty, price: unit });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const snapshotJson = JSON.stringify(snapshot);

      const [ins] = await conn.query(
        `INSERT INTO orders
          (user_id, status, delivery_type, payment_method, total_price, delivery_address, comment, checkout_snapshot, delivery_datetime)
         VALUES (?, 'new', ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          deliveryType,
          paymentMethod,
          total.toFixed(2),
          deliveryAddress,
          normalizedComment || null,
          snapshotJson,
          deliveryDatetime,
        ]
      );

      const orderId = ins.insertId;

      for (const line of lines) {
        await conn.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, line.menu_item_id, line.quantity, line.price.toFixed(2)]
        );
      }

      await conn.commit();

      return res.status(201).json({
        order: {
          id: orderId,
          displayNumber: formatDisplayOrderNumber(orderId),
          status: "new",
          total_price: total.toFixed(2),
        },
      });
    } catch (e) {
      await conn.rollback();
      if (String(e.message || "").includes("Unknown column") && String(e.message || "").includes("checkout_snapshot")) {
        return res.status(500).json({
          error:
            "В базе не применена миграция: выполните backend/migrations/20260512_orders_checkout_snapshot.sql",
        });
      }
      throw e;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось оформить заказ" });
  }
});

/** Все заказы клиента (история); предыдущие заказы не удаляются – смотрели только /my/latest */
router.get("/my", async (req, res) => {
  if (!requireClient(req, res)) return;

  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.status, o.delivery_type, o.total_price, o.created_at,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS position_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC, o.id DESC`,
      [req.user.id]
    );

    const orders = rows.map((row) => ({
      id: row.id,
      displayNumber: formatDisplayOrderNumber(row.id),
      status: row.status,
      delivery_type: row.delivery_type,
      total_price: row.total_price,
      created_at: row.created_at,
      position_count: Number(row.position_count) || 0,
    }));

    return res.json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось загрузить заказы" });
  }
});

/** Последний «текущий» заказ: не выдан, не получен и не отменен */
const CURRENT_ORDER_STATUSES = ["new", "confirmed", "cooking"];

router.get("/my/latest", async (req, res) => {
  if (!requireClient(req, res)) return;

  try {
    const placeholders = CURRENT_ORDER_STATUSES.map(() => "?").join(", ");
    const [orders] = await pool.query(
      `SELECT id, status, delivery_type, payment_method, total_price, delivery_address, comment,
              checkout_snapshot, delivery_datetime, created_at
       FROM orders
       WHERE user_id = ?
         AND status IN (${placeholders})
       ORDER BY created_at DESC, id DESC
       LIMIT 1`,
      [req.user.id, ...CURRENT_ORDER_STATUSES]
    );

    if (orders.length === 0) {
      return res.json({ order: null });
    }

    const order = orders[0];
    let snapshot = order.checkout_snapshot;
    if (typeof snapshot === "string") {
      try {
        snapshot = JSON.parse(snapshot);
      } catch {
        snapshot = null;
      }
    }

    const [items] = await pool.query(
      `SELECT oi.id, oi.quantity, oi.price, m.name AS title, m.weight, c.name AS category_name
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       LEFT JOIN categories c ON c.id = m.category_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [order.id]
    );

    return res.json({
      order: {
        id: order.id,
        displayNumber: formatDisplayOrderNumber(order.id),
        status: order.status,
        delivery_type: order.delivery_type,
        payment_method: order.payment_method,
        total_price: order.total_price,
        delivery_address: order.delivery_address,
        comment: order.comment,
        snapshot,
        delivery_datetime: order.delivery_datetime,
        created_at: order.created_at,
        items,
      },
    });
  } catch (error) {
    console.error(error);
    if (String(error.message || "").includes("Unknown column") && String(error.message || "").includes("checkout_snapshot")) {
      return res.status(500).json({
        error:
          "В базе не применена миграция: выполните backend/migrations/20260512_orders_checkout_snapshot.sql",
      });
    }
    return res.status(500).json({ error: "Не удалось загрузить заказ" });
  }
});

export default router;
