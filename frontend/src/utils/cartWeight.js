/**
 * Масштабирует подпись веса/объема (нап. "200 г", "250 мл") при изменении количества порций.
 */
export function formatWeightWithQuantity(weightLabel, quantity) {
  if (!weightLabel || quantity < 1) return weightLabel || "–";
  const raw = String(weightLabel).trim();
  const m = raw.match(/^([\d.,]+)\s*(.*)$/);
  if (!m) {
    return quantity > 1 ? `${raw} × ${quantity}` : raw;
  }
  const num = parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(num)) {
    return quantity > 1 ? `${raw} × ${quantity}` : raw;
  }
  const scaled = Math.round(num * quantity * 100) / 100;
  const suffix = (m[2] || "").trim();
  return suffix ? `${scaled} ${suffix}` : String(scaled);
}
