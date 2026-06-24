import "dotenv/config";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db/connection.js';
import testRouter from "./routes/test.js";
import menuRoutes from "./routes/menu.js";
import authRoutes from "./routes/auth.js";
import reservationRoutes from "./routes/reservations.js";
import favoritesRoutes from "./routes/favorites.js";
import adminRoutes from "./routes/admin.js";
import ordersRoutes from "./routes/orders.js";
import reviewsRoutes from "./routes/reviews.js";
import emailPreviewRoutes from "./routes/emailPreview.js";
import { isEmailPreviewEnabled } from "./lib/emailPreviewEnabled.js";
import { startReservationScheduler } from "./services/reservationScheduler.js";
import { uploadsDir } from "./middleware/menuUpload.js";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, '..');
const frontendDist = path.join(webRoot, 'frontend', 'dist');
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use("/api", testRouter);

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/dev/email-preview", emailPreviewRoutes);

if (isProduction) {
  // deploy.sh кладёт dist в /var/www/html/, а не в frontend/dist
  app.use('/img', express.static(path.join(webRoot, 'img')));
  app.use('/assets', express.static(path.join(webRoot, 'assets')));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(webRoot, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Папка изображений /uploads: ${uploadsDir}`);
  if (isEmailPreviewEnabled()) {
    console.log(
      `Превью писем: http://localhost:${PORT}/api/dev/email-preview/`
    );
  }
  startReservationScheduler();
});


