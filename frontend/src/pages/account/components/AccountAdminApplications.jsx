import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchAdminReservations } from "../../../services/adminService.js";

function formatId(id) {
  return String(id).padStart(5, "0");
}

function formatDateRu(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "–";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!m) return isoDate;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

const STATUS_LABEL = {
  pending: "Ожидает",
  confirmed: "Подтверждена",
  cancelled: "Отменена",
};

const STATUS_FILTERS = [
  { id: "all", label: "Все" },
  { id: "pending", label: "Ожидает" },
  { id: "confirmed", label: "Подтверждена" },
  { id: "cancelled", label: "Отменена" },
];

function sortByNewest(list) {
  return [...list].sort((a, b) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (tb !== ta) return tb - ta;
    return Number(b.id) - Number(a.id);
  });
}

export default function AccountAdminApplications() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminReservations(token);
      setRows(sortByNewest(data.reservations || []));
    } catch (e) {
      setError(e.message || "Ошибка загрузки");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  if (loading) {
    return <p className="account-admin-clients__status">Загрузка...</p>;
  }

  if (error) {
    return <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>;
  }

  return (
    <div className="account-admin-applications">
      <p className="account-admin-applications__text text-center mb-4">
        В этом разделе отображается список всех заявок на бронирование. Сначала показаны последние
        заявки.
      </p>

      <div className="account-admin-applications__filter">
        <label className="account-admin-applications__filter-label" htmlFor="applications-status-filter">
          Статус
        </label>
        <span className="account-admin-select">
          <select
            id="applications-status-filter"
            className="account-admin-orders__status"
            value={statusFilter}
            aria-label="Фильтр по статусу брони"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="account-admin-clients__status">Заявок на бронирование пока нет.</p>
      ) : visibleRows.length === 0 ? (
        <p className="account-admin-clients__status">
          Заявок со статусом «{STATUS_LABEL[statusFilter] || statusFilter}» нет.
        </p>
      ) : (
        <div className="account-admin-table-outer">
          <table className="account-admin-table account-admin-table--applications">
            <colgroup>
              <col style={{ width: "8%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Имя</th>
                <th scope="col">Телефон</th>
                <th scope="col">Email</th>
                <th scope="col">Дата</th>
                <th scope="col">Время</th>
                <th scope="col">Гостей</th>
                <th scope="col">Статус</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{formatId(row.id)}</td>
                  <td>{row.name}</td>
                  <td>{row.phone || "–"}</td>
                  <td>{row.email}</td>
                  <td>{formatDateRu(row.date)}</td>
                  <td>{row.time || "–"}</td>
                  <td>{row.guests_count}</td>
                  <td>{STATUS_LABEL[row.status] || row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
