import { Fragment, useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import {
  fetchAdminOrderById,
  fetchAdminOrders,
  patchAdminOrderStatus,
} from "../../../services/adminService.js";
import { orderStatusLabel, ORDER_STATUS_VALUES } from "../../../lib/orderStatus.js";
import { formatOrderCreatedAt, deliveryTypeShort } from "../../../utils/orderFormat.js";
import OrderDetailsBody from "./OrderDetailsBody.jsx";
import OrderDetailsSummary from "./OrderDetailsSummary.jsx";

export default function AccountAdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [detailsById, setDetailsById] = useState({});

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminOrders(token);
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
    async (orderId, listStatus) => {
      if (!token) return;
      setDetailsById((prev) => ({
        ...prev,
        [orderId]: { ...(prev[orderId] || {}), loading: true, error: "" },
      }));
      try {
        const data = await fetchAdminOrderById(token, orderId);
        setDetailsById((prev) => ({
          ...prev,
          [orderId]: {
            order: {
              ...data.order,
              status: listStatus ?? data.order.status,
            },
            loading: false,
            error: "",
          },
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

  const toggleOrder = (row) => {
    const orderId = row.id;
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    const cached = detailsById[orderId];
    if (cached?.order) {
      setDetailsById((prev) => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          order: { ...prev[orderId].order, status: row.status },
        },
      }));
    } else if (!cached?.loading) {
      loadOrderDetails(orderId, row.status);
    }
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!token) return;
    setSavingId(orderId);
    setError("");
    try {
      await patchAdminOrderStatus(token, orderId, nextStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
      setDetailsById((prev) => {
        const entry = prev[orderId];
        if (!entry?.order) return prev;
        return {
          ...prev,
          [orderId]: {
            ...entry,
            order: { ...entry.order, status: nextStatus },
          },
        };
      });
    } catch (e) {
      setError(e.message || "Не удалось сохранить статус");
      await load();
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p className="account-admin-clients__status">Загрузка...</p>;
  }

  if (error && orders.length === 0) {
    return (
      <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>
    );
  }

  if (orders.length === 0) {
    return <p className="account-admin-clients__status">Заказов пока нет.</p>;
  }

  return (
    <div className="account-admin-orders">
      <p className="account-admin-orders__text text-center mb-5">
        Список заказов клиентов. Нажмите на номер заказа, чтобы открыть состав и детали доставки.
      </p>
      {error ? (
        <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>
      ) : null}
      <div className="account-admin-table-outer">
        <table className="account-admin-table account-admin-table--orders">
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "24%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Клиент</th>
              <th scope="col">Дата создания</th>
              <th scope="col">Сумма</th>
              <th scope="col">Доставка</th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => {
              const isExpanded = expandedId === row.id;
              const detail = detailsById[row.id];

              return (
                <Fragment key={row.id}>
                  <tr
                    className={isExpanded ? "account-order-history__row is-expanded" : ""}
                  >
                    <td>
                      <button
                        type="button"
                        className="account-order-history__number"
                        onClick={() => toggleOrder(row)}
                        aria-expanded={isExpanded}
                        aria-controls={`admin-order-details-${row.id}`}
                      >
                        №{row.displayNumber}
                        <span className="account-order-history__chevron" aria-hidden>
                          {isExpanded ? " ▲" : " ▼"}
                        </span>
                      </button>
                    </td>
                    <td>{row.client_name}</td>
                    <td>{formatOrderCreatedAt(row.created_at)}</td>
                    <td>{Number(row.total_price)}₽</td>
                    <td>{deliveryTypeShort(row.delivery_type)}</td>
                    <td>
                      <select
                        className="account-admin-orders__status"
                        value={row.status}
                        disabled={savingId === row.id}
                        aria-label={`Статус заказа №${row.displayNumber}`}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                      >
                        {ORDER_STATUS_VALUES.map((st) => (
                          <option key={st} value={st}>
                            {orderStatusLabel(st)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr className="account-order-history__details-row">
                      <td colSpan={6} id={`admin-order-details-${row.id}`}>
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
