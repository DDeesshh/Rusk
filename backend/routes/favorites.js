import express from "express";
import { pool } from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.name AS title, m.ingredients, m.price, m.weight, m.image AS img,
              c.name AS category
       FROM favorites f
       JOIN menu_items m ON m.id = f.menu_item_id
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE f.user_id = ?
       ORDER BY f.id DESC`,
      [req.user.id]
    );

    const ids = rows.map((r) => r.id);
    return res.json({ items: rows, ids });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка загрузки избранного" });
  }
});

router.post("/", async (req, res) => {
  try {
    const menuItemId = Number(req.body.menu_item_id);
    if (!Number.isInteger(menuItemId)) {
      return res.status(400).json({ error: "Некорректный id блюда" });
    }

    const [items] = await pool.query("SELECT id FROM menu_items WHERE id = ? LIMIT 1", [
      menuItemId,
    ]);
    if (items.length === 0) {
      return res.status(404).json({ error: "Блюдо не найдено" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM favorites WHERE user_id = ? AND menu_item_id = ? LIMIT 1",
      [req.user.id, menuItemId]
    );
    if (existing.length > 0) {
      return res.status(200).json({ message: "Уже в избранном", already: true });
    }

    await pool.query("INSERT INTO favorites (user_id, menu_item_id) VALUES (?, ?)", [
      req.user.id,
      menuItemId,
    ]);

    return res.status(201).json({ message: "Добавлено в избранное" });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка добавления в избранное" });
  }
});

router.delete("/:menuItemId", async (req, res) => {
  try {
    const menuItemId = Number(req.params.menuItemId);
    if (!Number.isInteger(menuItemId)) {
      return res.status(400).json({ error: "Некорректный id блюда" });
    }

    const [result] = await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND menu_item_id = ?",
      [req.user.id, menuItemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }

    return res.json({ message: "Удалено из избранного" });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка удаления из избранного" });
  }
});

export default router;
