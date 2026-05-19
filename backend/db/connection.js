import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Пул соединений
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rusk',
  port: Number(process.env.DB_PORT || 3307),
});

// Проверка подключения
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Подключение к БД успешно!');
    connection.release();
  } catch (err) {
    console.error('Ошибка подключения к БД:', err);
  }
})();


