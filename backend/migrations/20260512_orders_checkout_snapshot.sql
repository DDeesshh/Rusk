-- Снимок данных чекаута (контакты, адрес) для отображения в ЛК.
-- Важно: колонку `comment` в AFTER обязательно в обратных кавычках – иначе MySQL
-- воспринимает слово comment как ключевое слово COMMENT и даёт #1064.
-- TEXT совместим со старыми MySQL/MariaDB; JSON можно заменить на JSON, если движок поддерживает.

ALTER TABLE `orders`
  ADD COLUMN `checkout_snapshot` TEXT NULL DEFAULT NULL AFTER `comment`;
