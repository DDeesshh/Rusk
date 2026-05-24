import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchLatestOrder } from "../../../services/orderService.js";
import OrderDetailsBody from "./OrderDetailsBody.jsx";
import OrderDetailsSummary from "./OrderDetailsSummary.jsx";

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

  return (
    <section className="account-order">
      <h2 className="account-order__page-title">Детали заказа</h2>

      <OrderDetailsSummary
        order={order}
        showToggle
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />

      {expanded ? <OrderDetailsBody order={order} /> : null}
    </section>
  );
}
