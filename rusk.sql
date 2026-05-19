-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3307
-- Время создания: Май 19 2026 г., 12:00
-- Версия сервера: 5.6.51
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `rusk`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Супы', ''),
(2, 'Горячее', NULL),
(3, 'Салаты', NULL),
(4, 'Закуски', NULL),
(5, 'Десерты', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `menu_item_id`) VALUES
(20, 4, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,0) NOT NULL,
  `weight` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `menu_items`
--

INSERT INTO `menu_items` (`id`, `category_id`, `name`, `ingredients`, `price`, `weight`, `image`, `created_at`) VALUES
(2, 1, 'Солянка', 'Мясной бульон, говядина, соленые огурцы, лук, оливки', '600', '350Г', 'uploads/solyanka.webp', '2026-03-02 19:00:29'),
(3, 1, 'Щи', 'Капуста, свинина, картофель, морковь, перец, зелень', '430', '300Г', 'uploads/shchi.webp', '2026-03-02 19:01:34'),
(4, 1, 'Уха', 'Щука, картофель, морковь, лук, перец, зелень, лимон', '650', '400Г', 'uploads/ykha.webp', '2026-03-02 19:02:57'),
(5, 2, 'Пельмени', 'Фарш говядины, лук, перец, специи, зелень', '500', '300Г', 'uploads/pelmeni.webp', '2026-03-02 19:07:47'),
(6, 2, 'Бефстроганов', 'Говядина, лук, сметана, масло растительное, грибы', '650', '250Г', 'uploads/beefstroganoff.webp', '2026-04-22 20:42:22'),
(7, 2, 'Голубцы', 'Капуста, фарш, рис, лук, морковь, перец', '490', '350Г', 'uploads/golubtsy.webp', '2026-04-22 20:44:58'),
(8, 3, 'Крабовый', 'Крабовые палочки, рис, кукуруза, яйца, укроп, соль.', '370', '200Г', 'uploads/krabovyy.webp', '2026-04-22 20:48:58'),
(9, 3, 'Мимоза', 'Тунец, яйца, картофель, морковь, лук, зелень, майонез', '540', '220Г', 'uploads/mimoza.webp', '2026-04-22 20:49:42'),
(10, 3, 'Столичный', 'Куриное филе, картофель, морковь, огурцы, яйца', '490', '210Г', 'uploads/stolichnyy.webp', '2026-04-22 20:50:40'),
(11, 3, 'Сельдь под шубой', 'Сельдь слабосоленая, картофель, морковь, свёкла, яйца, лук', '390', '190Г', 'uploads/sel_d.webp', '2026-04-22 20:51:27'),
(12, 4, 'Мясной рулет', 'Свинина, говядина, лук, чеснок, специи, зелень', '650', '150Г', 'uploads/rulet.webp', '2026-04-22 20:55:39'),
(13, 4, 'Грибы в сметане', 'Грибы, сметана, лук, сливочное масло, специи', '390', '150Г', 'uploads/griby.webp', '2026-04-22 20:56:21'),
(14, 4, 'Тосты с икрой', 'Багет, сливочное масло красная икра, зелень', '750', '110Г', 'uploads/tosty.webp', '2026-04-22 20:57:06'),
(15, 4, 'Копченная рыба', 'Форель, укроп, лимон, оливковое масло', '470', '220Г', 'uploads/ryuba.webp', '2026-04-22 20:58:02'),
(16, 5, 'Яблочный пирог', 'Яблоки, тесто, сливочное масло, яблочный сироп', '390', '160Г', 'uploads/pirog.webp', '2026-04-22 21:10:07'),
(17, 5, 'Медовик', 'Мука, сахар, яйца, сливочное масло, мёд, сметана', '420', '150Г', 'uploads/medovik.webp', '2026-04-22 21:10:07'),
(18, 5, 'Блины со сгущенкой', 'Мука, яйца, молоко, сахар, сгущённое молоко', '340', '160Г', 'uploads/bliny.webp', '2026-04-22 21:11:18'),
(19, 5, 'Пряники', 'Мука, мед, сахар, яйца, сливочное масло', '280', '100Г', 'uploads/pryaniki.webp', '2026-04-22 21:11:18'),
(20, 2, 'Тельная рыба', 'Филе трески, яичный кляр, овощи, специи, зелень', '550', '290Г', 'uploads/telnaya.webp', '2026-04-22 21:13:30'),
(23, 1, 'Борщ', 'Говядина, картофель, морковь, свекла, томатная паста', '450', '300Г', 'uploads/borsch.jpg', '2026-05-14 13:47:33');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('new','confirmed','cooking','delivered','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `delivery_type` enum('delivery','pickup') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('card','cash') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `delivery_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `checkout_snapshot` text COLLATE utf8mb4_unicode_ci,
  `delivery_datetime` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `delivery_type`, `payment_method`, `total_price`, `delivery_address`, `comment`, `checkout_snapshot`, `delivery_datetime`, `created_at`) VALUES
(1, 4, 'cancelled', 'pickup', 'card', '1150.00', NULL, NULL, '{\"name\":\"Яна\",\"phone\":\"+79916426677\",\"email\":\"111@mail.ru\",\"city\":\"\",\"street\":\"\",\"house\":\"\",\"apartment\":\"\",\"entrance\":\"\",\"floor\":\"\",\"intercom\":\"\",\"comment\":\"\"}', '2026-05-13 11:22:00', '2026-05-12 18:20:08'),
(2, 4, 'completed', 'delivery', 'card', '1100.00', 'Москва, Космонавтов, д. 3, кв./оф. 47, подъезд 4, эт. 4, домофон 4444', NULL, '{\"name\":\"Яна\",\"phone\":\"+79916426677\",\"email\":\"111@mail.ru\",\"city\":\"Москва\",\"street\":\"Космонавтов\",\"house\":\"3\",\"apartment\":\"47\",\"entrance\":\"4\",\"floor\":\"4\",\"intercom\":\"4444\",\"comment\":\"\"}', '2026-05-14 19:52:00', '2026-05-12 18:52:15'),
(3, 4, 'delivered', 'pickup', 'cash', '490.00', NULL, NULL, '{\"name\":\"Яна\",\"phone\":\"+79916426677\",\"email\":\"111@mail.ru\",\"city\":\"\",\"street\":\"\",\"house\":\"\",\"apartment\":\"\",\"entrance\":\"\",\"floor\":\"\",\"intercom\":\"\",\"comment\":\"\"}', '2026-05-13 18:29:00', '2026-05-12 19:29:44'),
(4, 4, 'completed', 'pickup', 'card', '960.00', NULL, NULL, '{\"name\":\"Яна\",\"phone\":\"+79916426677\",\"email\":\"111@mail.ru\",\"city\":\"\",\"street\":\"\",\"house\":\"\",\"apartment\":\"\",\"entrance\":\"\",\"floor\":\"\",\"intercom\":\"\",\"comment\":\"\"}', '2026-05-15 12:05:00', '2026-05-12 20:05:26'),
(5, 5, 'cancelled', 'delivery', 'card', '4970.00', 'Талдом, Снт Горшково, д. 59, кв./оф. 0, подъезд 0, эт. 0, домофон 0', NULL, '{\"name\":\"Дмитрий\",\"phone\":\"+79775119073\",\"email\":\"mdima081@mail.ru\",\"city\":\"Талдом\",\"street\":\"Снт Горшково\",\"house\":\"59\",\"apartment\":\"0\",\"entrance\":\"0\",\"floor\":\"0\",\"intercom\":\"0\",\"comment\":\"\"}', '2026-05-16 22:06:00', '2026-05-13 18:07:58');

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `quantity`, `price`) VALUES
(2, 1, 2, 1, '600.00'),
(4, 3, 7, 1, '490.00'),
(5, 4, 15, 1, '470.00'),
(6, 4, 10, 1, '490.00'),
(7, 5, 8, 6, '370.00');

-- --------------------------------------------------------

--
-- Структура таблицы `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `guests_count` int(11) NOT NULL,
  `status` enum('pending','confirmed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmation_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confirmation_sent_at` datetime DEFAULT NULL,
  `reminder_sent` tinyint(1) NOT NULL DEFAULT '0',
  `is_confirmed_by_user` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `name`, `phone`, `email`, `date`, `time`, `guests_count`, `status`, `comment`, `created_at`, `confirmation_token`, `confirmation_sent_at`, `reminder_sent`, `is_confirmed_by_user`) VALUES
(1, NULL, 'Оля', '+79916426843', 'salnikovadara068@gmail.com', '2026-04-22', '22:37:00', 1, 'confirmed', '111', '2026-04-22 19:35:06', '08729b7b6e349c6c1e82771e184c99409910593c69387a18c68dd33d814ed404', '2026-04-22 22:40:01', 1, 1),
(2, NULL, 'Тест', '+79991234567', 'test@example.com', '2026-04-23', '19:30:00', 3, 'pending', 'Стол у окна', '2026-04-22 19:40:17', '924383d9a57293d1e88ef256642bc0e5695e86e3ebae444f47651959c0e3bb66', '2026-04-23 00:20:02', 1, NULL),
(3, NULL, 'Гвен', '+79991234567', '9853491653@mail.ru', '2026-04-23', '20:30:00', 3, 'confirmed', 'Стол у окна', '2026-04-22 19:59:45', 'd81ee10342e8d5550811354ed4e62e9d19dc1112aa4ba271389d37df6e21b403', '2026-04-23 00:20:03', 1, 1),
(4, NULL, 'Гвен', '+79991234567', '9853491653@mail.ru', '2026-04-23', '12:30:00', 3, 'cancelled', 'Стол у окна', '2026-04-22 20:00:07', 'db23c89d99dc0020a038aac9fa4fcefd3b19d1bb004f0abea9a01e91ad9c7bfa', '2026-04-23 00:20:05', 1, 0),
(5, NULL, 'Дарья', '+79874453636', 'salnikovadara068@gmail.com', '2026-05-14', '11:25:00', 1, 'pending', 'нет', '2026-05-12 21:24:27', '75b17ec855f848852bafac96f43cb5926a8291a59909f43d0a608b3c7a8a1dfd', '2026-05-14 16:50:02', 1, NULL),
(6, NULL, 'Анатолий', '+79256296009', '9853491653@mail.ru', '2026-05-14', '16:30:00', 2, 'confirmed', NULL, '2026-05-12 21:27:09', 'd468a6e442c80d8573a0c7e717b34c23926f618a3387f80410a574bced06a61b', '2026-05-14 16:50:04', 1, 1),
(7, NULL, 'Дмитрий', '+79916426843', 'mdima081@mail.ru', '2026-05-14', '11:20:00', 2, 'pending', 'Нет', '2026-05-12 22:10:14', 'bdbd16a9f68ef607f4f144f894f8abb40309e80f8377d037e282d63cfd6f45ce', '2026-05-14 16:50:05', 1, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_item_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `menu_item_id`, `rating`, `comment`, `created_at`) VALUES
(3, 4, NULL, NULL, 'Очень уютный ресторан с приятной атмосферой и вкусной русской кухней. Блюда свежие, порции большие, всё подано красиво и аккуратно. Особенно понравились борщ и пельмени, действительно по-домашнему.', '2026-05-12 19:59:00');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_birth` date NOT NULL,
  `role` enum('client','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'client',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `date_birth`, `role`, `created_at`) VALUES
(1, 'Софья', 'sofia@2003.ru', '$2b$10$GXYaAhvk4hNpKJmmVVcVfuzqLdf7WZ8unaEjjrpOpU.Q15B5lUS..', '+79916426843', '2004-01-21', 'client', '2026-04-22 18:44:57'),
(2, 'Яс', 'ссс@222.ru', '$2b$10$/.FNxD4HCm/SDcdpDVKNMeCL84TU6SAb.kieVtexAK6.UJ8TXAgXS', '+79256296051', '2006-01-10', 'client', '2026-04-22 18:55:22'),
(3, 'Анастасия', '123@mail.ru', '$2b$10$.XXqnne83S1hFQszoQwkgOkzKkaA83j75gdd7kx8yWj1YgLO3axIa', '+79916426843', '2001-06-13', 'admin', '2026-05-08 06:50:57'),
(4, 'Яна', '111@mail.ru', '$2b$10$UHzj4rFk1JfPaYFVrmmB/.h7YHzYqZ2qJo.5CEn5U6LWXnGFMV77K', '+79916426677', '2000-01-19', 'client', '2026-05-12 13:55:20'),
(5, 'Дмитрий', 'mdima081@mail.ru', '$2b$10$fg41Y9/xU5lTRXIvj1F8tej8KbNz5VpjZDqZ3UI9gC.medI/Xq3NG', '+79775119073', '2003-09-07', 'client', '2026-05-13 18:01:57');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cartitem_menu` (`menu_item_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_favorite_user` (`user_id`),
  ADD KEY `fk_favorite_menu` (`menu_item_id`);

--
-- Индексы таблицы `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_menu_category` (`category_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_user` (`user_id`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orderitem_order` (`order_id`),
  ADD KEY `fk_orderitem_menu` (`menu_item_id`);

--
-- Индексы таблицы `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reservation_user` (`user_id`),
  ADD KEY `idx_reservations_date_status` (`date`,`status`),
  ADD KEY `idx_reservations_email` (`email`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_review_user` (`user_id`),
  ADD KEY `fk_review_menu` (`menu_item_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cartitem_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cartitem_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorite_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `fk_menu_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_orderitem_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
