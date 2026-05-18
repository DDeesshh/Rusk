import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchLatestOrder } from "../../../services/orderService.js";
import { orderStatusLabel } from "../../../lib/orderStatus.js";

function formatRuDateTime(iso) {
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
    const date = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
    const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  } catch {
    return { date: "–", time: "–" };
  }
}

function paymentLabel(method) {
  if (method === "cash") return "Наличными";
  return "Картой";
}

export default function AccountOrderDetails() {
  const { token } = useAuth();
  const [order, setOrder] = useState(undefined);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  const load = useCallback(async () => {
    if (!token) {
      setOrder(null);
      return;
    }
    setError("");
    try {
      const data = await fetchLatestOrder(token);
      setOrder(data.order || null);
    } catch (e) {
      setError(e.message || "Не удалось загрузить заказ");
      setOrder(null);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  if (order === undefined) {
    return (
      <section className="account-order" aria-busy="true">
        <h2 className="account-order__page-title">Детали заказа</h2>
        <p className="account-order__muted">Загрузка…</p>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="account-order">
        <h2 className="account-order__page-title">Детали заказа</h2>
        {error ? (
          <p className="account-order__error">{error}</p>
        ) : (
          <p className="account-order__muted">У вас нет текущих заказов.</p>
        )}
      </section>
    );
  }

  const snap = order.snapshot && typeof order.snapshot === "object" ? order.snapshot : {};
  const { date: delDate, time: delTime } = formatDeliveryAt(order.delivery_datetime);
  const isDelivery = order.delivery_type === "delivery";

  return (
    <section className="account-order">
      <h2 className="account-order__page-title">Детали заказа</h2>

      <div className="account-order__summary">
        <button
          type="button"
          className="account-order__toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span className="account-order__number">№{order.displayNumber}</span>
          <span className="account-order__chevron" aria-hidden>
            {expanded ? "▲" : "▼"}
          </span>
        </button>
        <p className="account-order__meta">
          <span className="account-order__meta-label">Дата создания:</span>{" "}
          {formatRuDateTime(order.created_at)}
        </p>
        <p className="account-order__meta">
          <span className="account-order__meta-label">Статус:</span> {orderStatusLabel(order.status)}
        </p>
      </div>

      {expanded ? (
        <div className="account-order__details">
          <div className="account-order__table-wrap">
            <table className="account-order__table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Гр/мл</th>
                  <th>Кол-во</th>
                  <th>Сумма</th>
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

          <p className="account-order__delivery-line">
            <span className="account-order__caption">Доставка:</span>{" "}
            <span className="account-order__delivery-type">{isDelivery ? "на дом" : "самовывоз"}</span>
          </p>

          {isDelivery ? (
            <div className="account-order__readonly-grid account-order__readonly-grid--2">
              <div className="account-order__field">
                <span className="account-order__caption">Город:</span>
                <span className="account-order__input-mimic">{snap.city || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Улица:</span>
                <span className="account-order__input-mimic">{snap.street || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Дом:</span>
                <span className="account-order__input-mimic">{snap.house || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Квартира/офис:</span>
                <span className="account-order__input-mimic">{snap.apartment || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Подъезд:</span>
                <span className="account-order__input-mimic">{snap.entrance || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Этаж:</span>
                <span className="account-order__input-mimic">{snap.floor || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Домофон:</span>
                <span className="account-order__input-mimic">{snap.intercom || "–"}</span>
              </div>
              <div className="account-order__field">
                <span className="account-order__caption">Комментарий:</span>
                <span className="account-order__input-mimic">{snap.comment || "–"}</span>
              </div>
            </div>
          ) : snap.comment ? (
            <div className="account-order__pickup-comment">
              <div className="account-order__field">
                <span className="account-order__caption">Комментарий:</span>
                <span className="account-order__input-mimic">{snap.comment}</span>
              </div>
            </div>
          ) : null}

          <div className="account-order__footer-meta">
            <p>
              <span className="account-order__meta-label">
                {isDelivery ? "Время доставки" : "Время получения"}:
              </span>{" "}
              {delTime}
            </p>
            <p>
              <span className="account-order__meta-label">
                {isDelivery ? "Дата доставки" : "Дата получения"}:
              </span>{" "}
              {delDate}
            </p>
            <p>
              <span className="account-order__meta-label">Способ оплаты:</span> {paymentLabel(order.payment_method)}
            </p>
          </div>

          <div className="account-order__total">
            <span className="account-order__total-caption">Итого:</span>{" "}
            <strong className="account-order__total-sum">{Number(order.total_price)}₽</strong>
          </div>
        </div>
      ) : null}
    </section>
  );
}
