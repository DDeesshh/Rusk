/** Часы ресторана: ПН–ПТ 11:00–21:00, СБ–ВС 11:00–24:00 (до конца календарного дня). */

export function minutesFromMidnight(timeStr) {
  const [h, m] = String(timeStr || "")
    .split(":")
    .map((x) => Number(x));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

export function isWeekdayDateString(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`);
  const w = d.getDay();
  return w !== 0 && w !== 6;
}

/** Последняя допустимая минута для самовывоза в этот день (включительно). */
export function pickupLastMinute(dateStr) {
  return isWeekdayDateString(dateStr) ? 21 * 60 : 24 * 60 - 1;
}

export function pickupFirstMinute() {
  return 11 * 60;
}

/** Доставка: нельзя 23:00–06:59 (ночной интервал). */
export function isDeliveryNightBlocked(timeStr) {
  const t = minutesFromMidnight(timeStr);
  if (t == null) return true;
  return t >= 23 * 60 || t < 7 * 60;
}

/** Последняя минута доставки с учётом ночного запрета и часов ресторана. */
export function deliveryLastMinute(dateStr) {
  const restaurantLast = isWeekdayDateString(dateStr) ? 21 * 60 : 24 * 60 - 1;
  const nightCap = 23 * 60 - 1; // до 22:59 включительно из-за блока с 23:00
  return Math.min(restaurantLast, nightCap);
}

export function validateOrderSlot(dateStr, timeStr, deliveryType) {
  if (!dateStr || !timeStr) {
    return "Укажите дату и время";
  }

  const t = minutesFromMidnight(timeStr);
  if (t == null) {
    return "Некорректное время";
  }

  const first = pickupFirstMinute();
  const slot = new Date(`${dateStr}T${timeStr}:00`);
  if (Number.isNaN(slot.getTime())) {
    return "Некорректная дата или время";
  }

  const now = new Date();
  if (slot < now) {
    return "Выберите будущую дату и время";
  }

  if (deliveryType === "pickup") {
    const last = pickupLastMinute(dateStr);
    if (t < first) {
      return "Самовывоз возможен не раньше 11:00";
    }
    if (t > last) {
      return isWeekdayDateString(dateStr)
        ? "В этот день самовывоз до 21:00"
        : "В выходной самовывоз до полуночи; выберите время не позже 23:59";
    }
    return null;
  }

  if (deliveryType === "delivery") {
    if (isDeliveryNightBlocked(timeStr)) {
      return "Доставка на дом доступна с 07:00 до 23:00";
    }
    const last = deliveryLastMinute(dateStr);
    if (t < first) {
      return "Доставка возможна не раньше 11:00";
    }
    if (t > last) {
      return isWeekdayDateString(dateStr)
        ? "В этот день доставка до 21:00"
        : "В выходной доставка до 22:59";
    }
    return null;
  }

  return "Некорректный способ получения";
}
