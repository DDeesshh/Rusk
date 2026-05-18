import { useCallback, useEffect, useState } from "react";
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

export default function AccountAdminApplications() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminReservations(token);
      setRows(data.reservations || []);
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

  if (loading) {
    return <p className="account-admin-clients__status">Загрузка...</p>;
  }

  if (error) {
    return <p className="account-admin-clients__status account-admin-clients__status--error">{error}</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="account-admin-clients__status">
        Заявок на бронирование пока нет.
      </p>
    );
  }

  return (
    <div className="account-admin-applications">
      <p className="account-admin-applications__text text-center mb-5">В этом разделе отображается список всех заявок на бронирование. Доступны их основные данные и информация для управления заявками.</p>
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
            {rows.map((row) => (
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
    </div>
  );
}
