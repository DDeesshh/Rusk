export function formatOrderCreatedAt(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function deliveryTypeShort(type) {
  if (type === "delivery") return "На дом";
  return "Самовывоз";
}

export function positionsLabel(count) {
  const n = Number(count) || 0;
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} позиция`;
  if (d >= 2 && d <= 4 && (dd < 10 || dd > 20)) return `${n} позиции`;
  return `${n} позиций`;
}
