import { deliveryTypeShort, paymentMethodLabel } from "../../../utils/orderFormat.js";

export function formatRuDateTime(iso) {
  if (!iso) return "–";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "–";
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "–";
  }
}

function formatDeliveryAt(iso) {
  if (!iso) return { date: "–", time: "–" };
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { date: "–", time: "–" };
    const date = d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  } catch {
    return { date: "–", time: "–" };
  }
}

/**
 * Состав заказа, доставка, оплата, итого (как на checkout / в профиле).
 */
export default function OrderDetailsBody({ order }) {
  if (!order) return null;

  const snap = order.snapshot && typeof order.snapshot === "object" ? order.snapshot : {};
  const { date: delDate, time: delTime } = formatDeliveryAt(order.delivery_datetime);
  const isDelivery = order.delivery_type === "delivery";

  return (
    <div className="account-order__details">
      <div className="account-admin-table-outer account-order__items-table">
        <table className="account-admin-table account-admin-table--order-items">
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Название</th>
              <th scope="col">Тип</th>
              <th scope="col">Гр/мл</th>
              <th scope="col">Кол-во</th>
              <th scope="col">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((row, idx) => (
              <tr key={row.id}>
                <td>{idx + 1}</td>
                <td>{row.title}</td>
                <td>{row.category_name || "–"}</td>
                <td>{row.weight || "–"}</td>
                <td>{row.quantity}</td>
                <td>{Number(row.price) * Number(row.quantity)}₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="account-order__meta account-order__delivery-meta">
        <span className="account-order__meta-label">Доставка:</span>{" "}
        <span className="account-order__meta-value">
          {deliveryTypeShort(order.delivery_type)}
        </span>
      </p>

      {isDelivery ? (
        <div className="account-order__readonly-grid account-order__readonly-grid--2">
          <div className="account-order__field">
            <span className="account-order__field-label">Город:</span>
            <span className="account-order__input-mimic">{snap.city || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Улица:</span>
            <span className="account-order__input-mimic">{snap.street || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Дом:</span>
            <span className="account-order__input-mimic">{snap.house || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Квартира/офис:</span>
            <span className="account-order__input-mimic">{snap.apartment || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Подъезд:</span>
            <span className="account-order__input-mimic">{snap.entrance || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Этаж:</span>
            <span className="account-order__input-mimic">{snap.floor || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Домофон:</span>
            <span className="account-order__input-mimic">{snap.intercom || "–"}</span>
          </div>
          <div className="account-order__field">
            <span className="account-order__field-label">Комментарий:</span>
            <span className="account-order__input-mimic">{snap.comment || "–"}</span>
          </div>
        </div>
      ) : snap.comment ? (
        <div className="account-order__pickup-comment">
          <div className="account-order__field">
            <span className="account-order__field-label">Комментарий:</span>
            <span className="account-order__input-mimic">{snap.comment}</span>
          </div>
        </div>
      ) : null}

      <div className="account-order__footer-meta">
        <p>
          <span className="account-order__meta-label">
            {isDelivery ? "Время доставки" : "Время получения"}:
          </span>{" "}
          <span className="account-order__meta-value">{delTime}</span>
        </p>
        <p>
          <span className="account-order__meta-label">
            {isDelivery ? "Дата доставки" : "Дата получения"}:
          </span>{" "}
          <span className="account-order__meta-value">{delDate}</span>
        </p>
        <p>
          <span className="account-order__meta-label">Способ оплаты:</span>{" "}
          <span className="account-order__meta-value">
            {paymentMethodLabel(order.payment_method)}
          </span>
        </p>
      </div>

      <div className="account-order__total">
        <span className="account-order__total-caption">Итого:</span>{" "}
        <strong className="account-order__total-sum">{Number(order.total_price)}₽</strong>
      </div>
    </div>
  );
}
