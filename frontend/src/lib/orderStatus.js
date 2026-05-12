const LABELS = {
  new: "В обработке",
  confirmed: "Принят",
  cooking: "Готовится",
  delivered: "Выдан",
  completed: "Получен",
  cancelled: "Отменен",
};

export function orderStatusLabel(status) {
  return LABELS[status] || status || "—";
}

/** Значения enum в БД – для селекта статуса в админке */
export const ORDER_STATUS_VALUES = [
  "new",
  "confirmed",
  "cooking",
  "delivered",
  "completed",
  "cancelled",
];
