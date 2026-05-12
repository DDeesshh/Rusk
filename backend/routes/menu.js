import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";
import { rolesMiddleware } from "../middleware/roles.js";
import { menuImageUpload, uploadsDir } from "../middleware/menuUpload.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        m.id,
        m.name AS title,
        m.ingredients,
        m.price,
        m.weight,
        m.image AS img,
        c.id AS category_id,
        c.name AS category
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY c.id, m.id;
    `);

    const result = Object.values(
      rows.reduce((acc, item) => {
        const key = item.category || "Без категории";
        if (!acc[key]) {
          acc[key] = {
            category: key,
            categoryId: item.category_id,
            items: [],
          };
        }
        acc[key].items.push(item);
        return acc;
      }, {})
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения меню" });
  }
});

router.post(
  "/items",
  authMiddleware,
  rolesMiddleware("admin"),
  (req, res, next) => {
    menuImageUpload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Ошибка загрузки файла" });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, ingredients, price, weight, category_id } = req.body;
      const name = String(title || "").trim();
      const categoryId = Number(category_id);
      const priceNum = Number(price);
      const weightStr = String(weight || "").trim() || null;
      const ingredientsStr = String(ingredients || "").trim() || null;

      if (!name || name.length > 150) {
        return res.status(400).json({ error: "Укажите название блюда" });
      }
      if (!Number.isInteger(categoryId)) {
        return res.status(400).json({ error: "Укажите категорию" });
      }
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: "Укажите корректную цену" });
      }

      const [cats] = await pool.query("SELECT id FROM categories WHERE id = ? LIMIT 1", [
        categoryId,
      ]);
      if (cats.length === 0) {
        return res.status(400).json({ error: "Категория не найдена" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Загрузите изображение (jpg, png, webp, gif, до 2 МБ)" });
      }

      const relativePath = `uploads/${req.file.filename}`;

      const [insert] = await pool.query(
        `INSERT INTO menu_items (category_id, name, ingredients, price, weight, image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [categoryId, name, ingredientsStr, Math.round(priceNum), weightStr, relativePath]
      );

      const [rows] = await pool.query(
        `SELECT m.id, m.name AS title, m.ingredients, m.price, m.weight, m.image AS img,
                c.id AS category_id, c.name AS category
         FROM menu_items m
         LEFT JOIN categories c ON m.category_id = c.id
         WHERE m.id = ?`,
        [insert.insertId]
      );

      return res.status(201).json({ item: rows[0] });
    } catch (error) {
      return res.status(500).json({ error: "Ошибка создания блюда" });
    }
  }
);

router.patch(
  "/items/:id",
  authMiddleware,
  rolesMiddleware("admin"),
  (req, res, next) => {
    menuImageUpload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Ошибка загрузки файла" });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Некорректный id" });
      }

      const { title, ingredients, price, weight, category_id } = req.body;
      const name = String(title || "").trim();
      const priceNum = Number(price);
      const weightStr = String(weight || "").trim() || null;
      const ingredientsStr = String(ingredients || "").trim() || null;
      const categoryRaw =
        category_id !== undefined && category_id !== null && String(category_id).trim() !== ""
          ? Number(category_id)
          : null;

      if (!name || name.length > 150) {
        return res.status(400).json({ error: "Укажите название блюда" });
      }
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: "Укажите корректную цену" });
      }

      const [existing] = await pool.query(
        "SELECT id, image, category_id FROM menu_items WHERE id = ? LIMIT 1",
        [id]
      );
      if (existing.length === 0) {
        return res.status(404).json({ error: "Блюдо не найдено" });
      }

      let useCategoryId = existing[0].category_id;
      if (categoryRaw != null) {
        if (!Number.isInteger(categoryRaw) || categoryRaw < 1) {
          return res.status(400).json({ error: "Укажите категорию" });
        }
        const [cats] = await pool.query("SELECT id FROM categories WHERE id = ? LIMIT 1", [
          categoryRaw,
        ]);
        if (cats.length === 0) {
          return res.status(400).json({ error: "Категория не найдена" });
        }
        useCategoryId = categoryRaw;
      }

      let imagePath = existing[0].image;
      const oldImage = existing[0].image;

      if (req.file) {
        const relativePath = `uploads/${req.file.filename}`;
        if (oldImage && String(oldImage).startsWith("uploads/")) {
          const absOld = path.join(uploadsDir, path.basename(oldImage));
          fs.unlink(absOld, () => {});
        }
        imagePath = relativePath;
      }

      await pool.query(
        `UPDATE menu_items
         SET category_id = ?, name = ?, ingredients = ?, price = ?, weight = ?, image = ?
         WHERE id = ?`,
        [
          useCategoryId,
          name,
          ingredientsStr,
          Math.round(priceNum),
          weightStr,
          imagePath,
          id,
        ]
      );

      const [rows] = await pool.query(
        `SELECT m.id, m.name AS title, m.ingredients, m.price, m.weight, m.image AS img,
                c.id AS category_id, c.name AS category
         FROM menu_items m
         LEFT JOIN categories c ON m.category_id = c.id
         WHERE m.id = ?`,
        [id]
      );

      return res.json({ item: rows[0] });
    } catch (error) {
      return res.status(500).json({ error: "Ошибка обновления блюда" });
    }
  }
);

router.delete(
  "/items/:id",
  authMiddleware,
  rolesMiddleware("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Некорректный id" });
      }

      const [rows] = await pool.query(
        "SELECT image FROM menu_items WHERE id = ? LIMIT 1",
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Блюдо не найдено" });
      }

      const imagePath = rows[0].image;
      await pool.query("DELETE FROM favorites WHERE menu_item_id = ?", [id]);
      await pool.query("DELETE FROM menu_items WHERE id = ?", [id]);

      if (imagePath && String(imagePath).startsWith("uploads/")) {
        const abs = path.join(uploadsDir, path.basename(imagePath));
        fs.unlink(abs, () => {});
      }

      return res.json({ message: "Блюдо удалено" });
    } catch (error) {
      return res.status(500).json({ error: "Ошибка удаления блюда" });
    }
  }
);

export default router;
