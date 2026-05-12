import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchAdminOrders, patchAdminOrderStatus } from "../../../services/adminService.js";
import { orderStatusLabel, ORDER_STATUS_VALUES } from "../../../lib/orderStatus.js";
import { formatOrderCreatedAt, deliveryTypeShort } from "../../../utils/orderFormat.js";

export default function AccountAdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

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

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!token) return;
    setSavingId(orderId);
    setError("");
    try {
      await patchAdminOrderStatus(token, orderId, nextStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
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
    return <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="account-admin-clients__status">Заказов пока нет.</p>;
  }

  return (
    <div className="account-admin-orders">
      {error ? <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p> : null}
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
              <th scope="col">Дата</th>
              <th scope="col">Сумма</th>
              <th scope="col">Доставка</th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row.id}>
                <td>№{row.displayNumber}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
