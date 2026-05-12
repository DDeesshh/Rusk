import express from "express";
import { isEmailPreviewEnabled } from "../lib/emailPreviewEnabled.js";
import {
  buildReservationCreatedPreviewHtml,
  buildReservationReminderPreviewHtml,
} from "../services/emailTemplates.js";

const router = express.Router();

router.use((req, res, next) => {
  if (!isEmailPreviewEnabled()) {
    return res.status(404).type("text/plain").send("Not found");
  }
  next();
});

/** GET /api/dev/email-preview/reservation-created */
router.get("/reservation-created", (req, res) => {
  res.type("html").send(buildReservationCreatedPreviewHtml());
});

/** GET /api/dev/email-preview/reservation-reminder */
router.get("/reservation-reminder", (req, res) => {
  res.type("html").send(buildReservationReminderPreviewHtml());
});

router.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><title>Превью писем RUSK</title></head>
<body style="font-family:system-ui,sans-serif;padding:24px;max-width:640px;">
  <h1 style="margin-top:0;">Превью писем</h1>
  <ul>
    <li><a href="./reservation-created">Заявка на бронь принята</a></li>
    <li><a href="./reservation-reminder">Напоминание с кнопками</a></li>
  </ul>
  <p style="color:#666;font-size:14px;">На localhost превью включено по умолчанию. В production — только при <code>ENABLE_EMAIL_PREVIEW=true</code>. Выключить локально: <code>ENABLE_EMAIL_PREVIEW=false</code>.</p>
</body></html>`);
});

export default router;
