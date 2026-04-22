import cron from "node-cron";
import { sendReminderEmails } from "../routes/reservations.js";

export const startReservationScheduler = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      await sendReminderEmails();
    } catch (error) {
      console.error("Ошибка авто-рассылки бронирований:", error.message);
    }
  });
};
