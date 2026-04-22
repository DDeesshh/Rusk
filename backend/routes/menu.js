// вывод меню из бд

import express from "express";
import { pool } from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT 
      m.id, m.name AS title, m.ingredients, m.price, m.weight, m.image AS img, c.name AS category
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY c.id;
    `);

        const result = Object.values(
            rows.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = { category: item.category, items: [] };
                acc[item.category].items.push(item);
                return acc;
            }, {})
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения меню" });
    }
});

export default router;




