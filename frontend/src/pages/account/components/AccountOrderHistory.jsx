import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchMyOrders } from "../../../services/orderService.js";
import { orderStatusLabel } from "../../../lib/orderStatus.js";
import { formatOrderCreatedAt, positionsLabel } from "../../../utils/orderFormat.js";

export default function AccountOrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <p className="account-admin-clients__status">Загрузка...</p>;
  }

  if (error) {
    return <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="account-admin-clients__status">У вас пока нет заказов. Оформите заказ в корзине.</p>
    );
  }

  return (
    <div className="account-order-history">
      <p className="account-order-history__text text-center mb-5">Здесь отображается история ваших заказов. Вы можете отслеживать статусы заказов и просматривать состав заказов.</p>
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
            {orders.map((row) => (
              <tr key={row.id}>
                <td>№{row.displayNumber}</td>
                <td>{formatOrderCreatedAt(row.created_at)}</td>
                <td>{positionsLabel(row.position_count)}</td>
                <td>{Number(row.total_price)}₽</td>
                <td>{orderStatusLabel(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
