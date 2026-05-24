import { orderStatusLabel } from "../../../lib/orderStatus.js";
import { formatRuDateTime } from "./OrderDetailsBody.jsx";

/**
 * Шапка деталей заказа: дата создания и статус (как в профиле).
 */
export default function OrderDetailsSummary({ order, showToggle = false, expanded, onToggle }) {
  if (!order) return null;

  return (
    <div className="account-order__summary">
      {showToggle ? (
        <button
          type="button"
          className="account-order__toggle"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="account-order__number">№{order.displayNumber}</span>
          <span className="account-order__chevron" aria-hidden>
            {expanded ? "▲" : "▼"}
          </span>
        </button>
      ) : null}
      <p className="account-order__meta">
        <span className="account-order__meta-label">Дата создания:</span>{" "}
        {formatRuDateTime(order.created_at)}
      </p>
      <p className="account-order__meta">
        <span className="account-order__meta-label">Статус:</span> {orderStatusLabel(order.status)}
      </p>
    </div>
  );
}
