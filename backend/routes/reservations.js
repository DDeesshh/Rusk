import crypto from "crypto";
import express from "express";
import { pool } from "../db/connection.js";
import {
  sendReservationCreatedEmail,
  sendReservationReminderEmail,
} from "../services/mailService.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;

const toIsoDate = (date) => new Date(date).toISOString().slice(0, 10);
const getWorkingHoursByDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) {
    return { startMinutes: 11 * 60, endMinutes: 23 * 60, label: "11:00-23:00" };
  }

  return { startMinutes: 11 * 60, endMinutes: 20 * 60, label: "11:00-20:00" };
};

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      date,
      time,
      guests_count,
      comment,
      user_id = null,
    } = req.body;

    const normalizedName = String(name || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedComment = String(comment || "").trim();
    const guests = Number(guests_count);

    if (
      !normalizedName ||
      !normalizedPhone ||
      !normalizedEmail ||
      !date ||
      !time ||
      !Number.isInteger(guests)
    ) {
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

    if (guests < 1 || guests > 20) {
      return res.status(400).json({ error: "Количество гостей должно быть от 1 до 20" });
    }

    if (normalizedComment.length > 1000) {
      return res.status(400).json({ error: "Комментарий не должен превышать 1000 символов" });
    }

    const requestedDate = new Date(date);
    if (Number.isNaN(requestedDate.getTime())) {
      return res.status(400).json({ error: "Некорректная дата" });
    }

    if (toIsoDate(requestedDate) < toIsoDate(new Date())) {
      return res.status(400).json({ error: "Дата брони не может быть в прошлом" });
    }

    if (!/^\d{2}:\d{2}$/.test(String(time))) {
      return res.status(400).json({ error: "Некорректное время" });
    }

    const [hours, minutes] = String(time).split(":").map(Number);
    if (minutes < 0 || minutes > 59 || hours < 0 || hours > 23) {
      return res.status(400).json({ error: "Некорректное время" });
    }

    const selectedMinutes = hours * 60 + minutes;
    const workingHours = getWorkingHoursByDate(date);
    if (
      selectedMinutes < workingHours.startMinutes ||
      selectedMinutes > workingHours.endMinutes
    ) {
      return res.status(400).json({
        error: `В выбранный день бронирование доступно только с ${workingHours.label}`,
      });
    }

    const [duplicates] = await pool.query(
      `SELECT id
       FROM reservations
       WHERE date = ? AND time = ? AND (phone = ? OR email = ?)
         AND status IN ('pending', 'confirmed')
       LIMIT 1`,
      [date, `${time}:00`, normalizedPhone, normalizedEmail]
    );

    if (duplicates.length > 0) {
      return res
        .status(409)
        .json({ error: "У вас уже есть активная бронь на эту дату и время" });
    }

    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const [result] = await pool.query(
      `INSERT INTO reservations
      (user_id, name, phone, email, date, time, guests_count, status, comment, confirmation_token, reminder_sent, is_confirmed_by_user)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, 0, NULL)`,
      [
        user_id || null,
        normalizedName,
        normalizedPhone,
        normalizedEmail,
        date,
        `${time}:00`,
        guests,
        normalizedComment || null,
        confirmationToken,
      ]
    );

    const reservation = {
      id: result.insertId,
      name: normalizedName,
      phone: normalizedPhone,
      email: normalizedEmail,
      date,
      time,
      guests_count: guests,
      comment: normalizedComment,
      confirmation_token: confirmationToken,
    };

    await sendReservationCreatedEmail(reservation);
    return res.status(201).json({
      message: "Заявка на бронь принята. Мы отправили письмо на ваш email.",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка создания брони" });
  }
});

router.get("/confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const [result] = await pool.query(
      `UPDATE reservations
       SET status = 'confirmed', is_confirmed_by_user = 1
       WHERE confirmation_token = ?`,
      [token]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Ссылка подтверждения недействительна");
    }

    return res.send("Спасибо! Бронь подтверждена.");
  } catch (error) {
    return res.status(500).send("Ошибка подтверждения брони");
  }
});

router.get("/cancel/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const [result] = await pool.query(
      `UPDATE reservations
       SET status = 'cancelled', is_confirmed_by_user = 0
       WHERE confirmation_token = ?`,
      [token]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Ссылка отмены недействительна");
    }

    return res.send("Бронь отменена.");
  } catch (error) {
    return res.status(500).send("Ошибка отмены брони");
  }
});

export const sendReminderEmails = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, email, date, time, guests_count, confirmation_token
     FROM reservations
     WHERE date = CURDATE()
       AND status IN ('pending', 'confirmed')
       AND reminder_sent = 0`
  );

  if (rows.length === 0) {
    return;
  }

  const baseUrl = process.env.BACKEND_PUBLIC_URL || "http://localhost:4000";

  for (const row of rows) {
    const token = row.confirmation_token || crypto.randomBytes(32).toString("hex");
    const confirmUrl = `${baseUrl}/api/reservations/confirm/${token}`;
    const cancelUrl = `${baseUrl}/api/reservations/cancel/${token}`;

    await sendReservationReminderEmail({
      reservation: {
        ...row,
        date: toIsoDate(row.date),
        time: String(row.time).slice(0, 5),
      },
      confirmUrl,
      cancelUrl,
    });

    await pool.query(
      `UPDATE reservations
       SET reminder_sent = 1, confirmation_sent_at = NOW(), confirmation_token = ?
       WHERE id = ?`,
      [token, row.id]
    );
  }
};

export default router;
