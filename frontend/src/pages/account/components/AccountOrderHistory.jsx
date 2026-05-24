import { Fragment, useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchMyOrderById, fetchMyOrders } from "../../../services/orderService.js";
import { orderStatusLabel } from "../../../lib/orderStatus.js";
import { formatOrderCreatedAt, positionsLabel } from "../../../utils/orderFormat.js";
import OrderDetailsBody from "./OrderDetailsBody.jsx";
import OrderDetailsSummary from "./OrderDetailsSummary.jsx";

export default function AccountOrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [detailsById, setDetailsById] = useState({});

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const data = await fetchMyOrders(token);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (e) {
      setError(e.message || "Ошибка загрузки");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const loadOrderDetails = useCallback(
    async (orderId) => {
      if (!token) return;
      setDetailsById((prev) => ({
        ...prev,
        [orderId]: { ...(prev[orderId] || {}), loading: true, error: "" },
      }));
      try {
        const data = await fetchMyOrderById(token, orderId);
        setDetailsById((prev) => ({
          ...prev,
          [orderId]: { order: data.order, loading: false, error: "" },
        }));
      } catch (e) {
        setDetailsById((prev) => ({
          ...prev,
          [orderId]: {
            order: null,
            loading: false,
            error: e.message || "Не удалось загрузить заказ",
          },
        }));
      }
    },
    [token]
  );

  const toggleOrder = (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    const cached = detailsById[orderId];
    if (!cached?.order && !cached?.loading) {
      loadOrderDetails(orderId);
    }
  };

  if (loading) {
    return <p className="account-admin-clients__status">Загрузка...</p>;
  }

  if (error) {
    return (
      <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="account-admin-clients__status">
        У вас пока нет заказов. Оформите заказ в корзине.
      </p>
    );
  }

  return (
    <div className="account-order-history">
      <p className="account-order-history__text text-center mb-5">
        Здесь отображается история ваших заказов. Нажмите на номер заказа, чтобы увидеть состав и
        детали доставки.
      </p>
      <div className="account-admin-table-outer">
        <table className="account-admin-table account-admin-table--history">
          <colgroup>
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "28%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Дата</th>
              <th scope="col">Состав</th>
              <th scope="col">Сумма</th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => {
              const isExpanded = expandedId === row.id;
              const detail = detailsById[row.id];

              return (
                <Fragment key={row.id}>
                  <tr className={isExpanded ? "account-order-history__row is-expanded" : ""}>
                    <td>
                      <button
                        type="button"
                        className="account-order-history__number"
                        onClick={() => toggleOrder(row.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`order-details-${row.id}`}
                      >
                        №{row.displayNumber}
                        <span className="account-order-history__chevron" aria-hidden>
                          {isExpanded ? " ▲" : " ▼"}
                        </span>
                      </button>
                    </td>
                    <td>{formatOrderCreatedAt(row.created_at)}</td>
                    <td>{positionsLabel(row.position_count)}</td>
                    <td>{Number(row.total_price)}₽</td>
                    <td>{orderStatusLabel(row.status)}</td>
                  </tr>
                  {isExpanded ? (
                    <tr className="account-order-history__details-row">
                      <td colSpan={5} id={`order-details-${row.id}`}>
                        <div className="account-order-history__details-panel">
                          {detail?.loading ? (
                            <p className="account-order-history__details-status">Загрузка…</p>
                          ) : null}
                          {detail?.error ? (
                            <p className="account-order-history__details-status account-order-history__details-status--error">
                              {detail.error}
                            </p>
                          ) : null}
                          {detail?.order ? (
                            <section className="account-order account-order--embedded">
                              <OrderDetailsSummary order={detail.order} />
                              <OrderDetailsBody order={detail.order} />
                            </section>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
