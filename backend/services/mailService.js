import nodemailer from "nodemailer";
import {
  buildReservationCreatedEmail,
  buildReservationReminderEmail,
} from "./emailTemplates.js";

const hasSmtpConfig =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.MAIL_FROM;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      family: 4,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.warn(
      "SMTP не настроен: письмо не отправлено. Заполните SMTP_* и MAIL_FROM в .env"
    );
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};

export const sendReservationCreatedEmail = async (reservation) => {
  const { email } = reservation;

  await sendEmail({
    to: email,
    subject: "RUSK: заявка на бронь принята",
    html: buildReservationCreatedEmail(reservation),
  });
};

export const sendReservationReminderEmail = async ({
  reservation,
  confirmUrl,
  cancelUrl,
}) => {
  await sendEmail({
    to: reservation.email,
    subject: "RUSK: подтвердите бронь на сегодня",
    html: buildReservationReminderEmail({ reservation, confirmUrl, cancelUrl }),
  });
};
