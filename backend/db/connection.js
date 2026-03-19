import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Пул соединений
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'rusk',
  port: 3307
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


