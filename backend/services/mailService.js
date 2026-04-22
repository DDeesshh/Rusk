import nodemailer from "nodemailer";

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
  const { email, name, date, time, guests_count, id } = reservation;

  await sendEmail({
    to: email,
    subject: "RUSK: заявка на бронь принята",
    html: `
      <h2>Здравствуйте, ${name}!</h2>
      <p>Мы получили вашу заявку на бронь стола.</p>
      <ul>
        <li><strong>Номер заявки:</strong> ${id}</li>
        <li><strong>Дата:</strong> ${date}</li>
        <li><strong>Время:</strong> ${time}</li>
        <li><strong>Гостей:</strong> ${guests_count}</li>
      </ul>
      <p>Спасибо, что выбрали ресторан RUSK.</p>
    `,
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
    html: `
      <h2>Здравствуйте, ${reservation.name}!</h2>
      <p>Напоминаем о вашей брони на сегодня.</p>
      <ul>
        <li><strong>Дата:</strong> ${reservation.date}</li>
        <li><strong>Время:</strong> ${reservation.time}</li>
        <li><strong>Гостей:</strong> ${reservation.guests_count}</li>
      </ul>
      <p>Пожалуйста, подтвердите, что вы придете:</p>
      <p>
        <a href="${confirmUrl}" style="margin-right: 16px;">Подтвердить бронь</a>
        <a href="${cancelUrl}">Отменить бронь</a>
      </p>
    `,
  });
};
