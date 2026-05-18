import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const getAge = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
};

const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, date_birth } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();

    if (!normalizedName || !normalizedEmail || !password || !date_birth) {
      return res.status(400).json({ error: "Заполните обязательные поля" });
    }

    if (normalizedName.length < 2) {
      return res.status(400).json({ error: "Имя должно быть не короче 2 символов" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: "Некорректный email" });
    }

    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ error: "Телефон должен быть в формате +79991234567" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ error: "Пароль: минимум 8 символов, буквы и цифры" });
    }

    if (getAge(date_birth) < 18) {
      return res.status(400).json({ error: "Регистрация доступна только с 18 лет" });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email уже используется" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, date_birth, role)
       VALUES (?, ?, ?, ?, ?, 'client')`,
      [normalizedName, normalizedEmail, passwordHash, normalizedPhone, date_birth]
    );

    const user = {
      id: result.insertId,
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      date_birth,
      role: "client",
    };

    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка регистрации" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Введите email и пароль" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: "Некорректный email" });
    }

    const [rows] = await pool.query(
      `SELECT id, name, email, password, phone, date_birth, role
       FROM users WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const userFromDb = rows[0];
    const isPasswordValid = await bcrypt.compare(password, userFromDb.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = signToken(userFromDb);
    const user = {
      id: userFromDb.id,
      name: userFromDb.name,
      email: userFromDb.email,
      phone: userFromDb.phone,
      date_birth: userFromDb.date_birth,
      role: userFromDb.role,
    };

    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка авторизации" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, date_birth, role, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    return res.json({ user: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка получения профиля" });
  }
});

router.patch("/me/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Введите текущий и новый пароль" });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({ error: "Пароль: минимум 8 символов, буквы и цифры" });
    }

    if (String(currentPassword) === String(newPassword)) {
      return res.status(400).json({ error: "Новый пароль должен отличаться от текущего" });
    }

    const [rows] = await pool.query(
      "SELECT password FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, rows[0].password);

    if (!isCurrentValid) {
      return res.status(401).json({ error: "Неверный текущий пароль" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      passwordHash,
      req.user.id,
    ]);

    return res.json({ message: "Пароль обновлён" });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка смены пароля" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();

    if (!normalizedName || !normalizedEmail || !normalizedPhone) {
      return res.status(400).json({ error: "Заполните обязательные поля" });
    }

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({ error: "Имя должно быть от 2 до 100 символов" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: "Некорректный email" });
    }

    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ error: "Телефон должен быть в формате +79991234567" });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
      [normalizedEmail, req.user.id]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Этот email уже используется" });
    }

    await pool.query(
      `UPDATE users
       SET name = ?, email = ?, phone = ?
       WHERE id = ?`,
      [normalizedName, normalizedEmail, normalizedPhone, req.user.id]
    );

    const [rows] = await pool.query(
      `SELECT id, name, email, phone, date_birth, role, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    return res.json({ user: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка обновления профиля" });
  }
});

export default router;
