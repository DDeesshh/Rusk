import express from "express";
import { pool } from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";
import { rolesMiddleware } from "../middleware/roles.js";

const router = express.Router();

const MIN_LEN = 5;
const MAX_LEN = 2000;

function mapRow(row) {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at || "");
  return {
    id: row.id,
    text: row.comment ?? "",
    author: row.author_name ?? "",
    createdAt,
  };
}

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.comment, r.created_at, u.name AS author_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       ORDER BY r.created_at DESC, r.id DESC`
    );
    res.json({ reviews: rows.map(mapRow) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось загрузить отзывы" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ error: "Отзыв могут оставлять только клиенты" });
  }

  const raw = String(req.body.comment ?? req.body.text ?? "").trim();
  if (raw.length < MIN_LEN) {
    return res.status(400).json({ error: `Текст отзыва не короче ${MIN_LEN} символов` });
  }
  if (raw.length > MAX_LEN) {
    return res.status(400).json({ error: `Текст отзыва не длиннее ${MAX_LEN} символов` });
  }

  const userId = Number(req.user.id);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: "Некорректный пользователь" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO reviews (user_id, menu_item_id, rating, comment)
       VALUES (?, NULL, NULL, ?)`,
      [userId, raw]
    );

    const insertId = result.insertId;
    const [rows] = await pool.query(
      `SELECT r.id, r.comment, r.created_at, u.name AS author_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       WHERE r.id = ?`,
      [insertId]
    );

    if (!rows.length) {
      return res.status(500).json({ error: "Отзыв создан, но не удалось его прочитать" });
    }

    res.status(201).json({ review: mapRow(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось сохранить отзыв" });
  }
});

router.delete(
  "/:id",
  authMiddleware,
  rolesMiddleware("admin"),
  async (req, res) => {
    const id = Number.parseInt(String(req.params.id), 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ error: "Некорректный идентификатор" });
    }

    try {
      const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Отзыв не найден" });
      }
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Не удалось удалить отзыв" });
    }
  }
);

export default router;
