/**
 * HTML-письма RUSK: инлайн-стили и табличная вёрстка для почтовых клиентов.
 * Цвета из светлой темы сайта (--primary-color, --decorate-bg).
 */

const BRAND_GOLD = "#8B6B3F";
const BRAND_GOLD_DARK = "#7C5E35";
const BG_PAGE = "#F5F5F5";
const BG_CARD = "#ffffff";
const TEXT_MAIN = "#1a1a1a";
const TEXT_MUTED = "#4e4e4e";
const BORDER_SUBTLE = "#e8e4df";

export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimeDisplay(time) {
  const s = String(time || "");
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function formatDateRu(dateStr) {
  try {
    const d = new Date(`${String(dateStr).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return escapeHtml(dateStr);
    return d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return escapeHtml(dateStr);
  }
}

function preheaderBlock(text) {
  const t = escapeHtml(text);
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${BG_PAGE};opacity:0;">${t}</div>`;
}

function detailRow(label, valueHtml) {
  return `
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid ${BORDER_SUBTLE};font-family:Georgia,'Merriweather',serif;font-size:15px;color:${TEXT_MUTED};width:42%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:12px 16px;border-bottom:1px solid ${BORDER_SUBTLE};font-family:Georgia,'Merriweather',serif;font-size:15px;color:${TEXT_MAIN};font-weight:700;vertical-align:top;">${valueHtml}</td>
  </tr>`;
}

function ctaButton(href, label, { variant = "primary" } = {}) {
  const isPrimary = variant === "primary";
  const bg = isPrimary ? BRAND_GOLD : BG_CARD;
  const color = isPrimary ? "#ffffff" : BRAND_GOLD;
  const border = isPrimary ? "none" : `2px solid ${BRAND_GOLD}`;
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
    <tr>
      <td style="border-radius:6px;background:${bg};border:${border};mso-padding-alt:14px 28px;">
        <a href="${safeHref}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;padding:14px 28px;font-family:Georgia,'Merriweather',serif;font-size:15px;font-weight:700;color:${color};text-decoration:none;line-height:1.2;">${safeLabel}</a>
      </td>
    </tr>
  </table>`;
}

function emailShell({ title, preheader, innerBody }) {
  const safeTitle = escapeHtml(title);
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${safeTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${BG_PAGE};-webkit-text-size-adjust:100%;">
  ${preheaderBlock(preheader)}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BG_PAGE};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:${BG_CARD};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_GOLD} 0%,${BRAND_GOLD_DARK} 100%);padding:28px 24px;text-align:center;">
              <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:600;letter-spacing:0.12em;color:#ffffff;line-height:1.2;">RUSK</p>
              <p style="margin:8px 0 0;font-family:Georgia,'Merriweather',serif;font-size:14px;color:rgba(255,255,255,0.92);line-height:1.4;">Русская кухня · бронирование</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 36px;font-family:Georgia,'Merriweather',serif;color:${TEXT_MAIN};">
              ${innerBody}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="margin:0;padding-top:20px;border-top:1px solid ${BORDER_SUBTLE};font-family:Georgia,'Merriweather',serif;font-size:13px;color:${TEXT_MUTED};line-height:1.6;text-align:center;">
                Это письмо отправлено автоматически. Отвечать на него не нужно.<br>
                <span style="color:${BRAND_GOLD};font-weight:600;">RUSK</span> · ресторан
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildReservationCreatedEmail(reservation) {
  const name = escapeHtml(reservation.name);
  const id = escapeHtml(String(reservation.id));
  const dateRu = formatDateRu(reservation.date);
  const timeDisp = escapeHtml(formatTimeDisplay(reservation.time));
  const guests = escapeHtml(String(reservation.guests_count));

  const inner = `
    <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:600;color:${TEXT_MAIN};line-height:1.3;">Здравствуйте, ${name}!</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:${TEXT_MUTED};">Мы получили вашу заявку на бронь стола. Ниже – детали. До встречи в RUSK.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid ${BORDER_SUBTLE};border-radius:8px;overflow:hidden;margin:0 0 24px;">
      ${detailRow("Номер заявки", id)}
      ${detailRow("Дата", escapeHtml(dateRu))}
      ${detailRow("Время", timeDisp)}
      ${detailRow("Гостей", guests)}
    </table>
    <p style="margin:0;font-size:16px;line-height:1.65;color:${TEXT_MUTED};">Спасибо, что выбрали нас. При необходимости мы свяжемся с вами по телефону из заявки.</p>
  `;

  return emailShell({
    title: "RUSK – заявка на бронь принята",
    preheader: `Заявка №${reservation.id} принята. ${dateRu}, ${timeDisp}.`,
    innerBody: inner,
  });
}

export function buildReservationReminderEmail({ reservation, confirmUrl, cancelUrl }) {
  const name = escapeHtml(reservation.name);
  const dateRu = formatDateRu(reservation.date);
  const timeDisp = escapeHtml(formatTimeDisplay(reservation.time));
  const guests = escapeHtml(String(reservation.guests_count));

  const inner = `
    <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:600;color:${TEXT_MAIN};line-height:1.3;">Здравствуйте, ${name}!</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:${TEXT_MUTED};">Напоминаем о вашей брони <strong style="color:${TEXT_MAIN};">на сегодня</strong>. Подтвердите визит одной кнопкой – так мы сможем лучше подготовить стол.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid ${BORDER_SUBTLE};border-radius:8px;overflow:hidden;margin:0 0 28px;">
      ${detailRow("Дата", escapeHtml(dateRu))}
      ${detailRow("Время", timeDisp)}
      ${detailRow("Гостей", guests)}
    </table>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_MUTED};text-align:center;">Подтвердите, что вы придёте:</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding:0 0 14px;">${ctaButton(confirmUrl, "Подтвердить бронь", { variant: "primary" })}</td>
      </tr>
      <tr>
        <td align="center" style="padding:0 0 8px;">${ctaButton(cancelUrl, "Отменить бронь", { variant: "outline" })}</td>
      </tr>
    </table>
    <p style="margin:20px 0 0;font-size:13px;line-height:1.55;color:${TEXT_MUTED};text-align:center;">Если планы изменились, нажмите «Отменить бронь» – стол освободится для других гостей.</p>
  `;

  return emailShell({
    title: "RUSK – подтвердите бронь",
    preheader: `Бронь на сегодня, ${timeDisp}. Подтвердите или отмените.`,
    innerBody: inner,
  });
}

/** Демо-данные для превью в браузере (GET /api/dev/email-preview/...). */
export function mockReservationCreated() {
  return {
    id: 42,
    name: "Анна",
    date: "2026-05-20",
    time: "19:30:00",
    guests_count: 4,
  };
}

export function mockReservationReminder() {
  return {
    name: "Анна",
    date: "2026-05-12",
    time: "18:00:00",
    guests_count: 2,
  };
}

export function buildReservationCreatedPreviewHtml() {
  return buildReservationCreatedEmail(mockReservationCreated());
}

export function buildReservationReminderPreviewHtml() {
  const siteUrl =
    process.env.PUBLIC_SITE_URL ||
    process.env.BACKEND_PUBLIC_URL ||
    "http://localhost:4000";
  return buildReservationReminderEmail({
    reservation: mockReservationReminder(),
    confirmUrl: `${siteUrl}/reservation/confirm/preview-token`,
    cancelUrl: `${siteUrl}/reservation/cancel/preview-token`,
  });
}
