import express from 'express';
import { pool } from './db/connection.js';
import testRouter from "./routes/test.js";
import menuRoutes from "./routes/menu.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use("/api", testRouter);
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);



