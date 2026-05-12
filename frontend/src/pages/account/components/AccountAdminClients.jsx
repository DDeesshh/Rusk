import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchAdminClients } from "../../../services/adminService.js";

function formatBirth(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!m) return isoDate;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

function formatId(id) {
  return String(id).padStart(5, "0");
}

export default function AccountAdminClients() {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminClients(token);
      setClients(data.clients || []);
    } catch (e) {
      setError(e.message || "Ошибка загрузки");
      setClients([]);
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

  if (clients.length === 0) {
    return (
      <p className="account-admin-clients__status">
        Зарегистрированных клиентов пока нет.
      </p>
    );
  }

  return (
    <div className="account-admin-clients">
      <div className="account-admin-table-outer">
        <table className="account-admin-table account-admin-table--clients">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "24%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Имя</th>
              <th scope="col">Телефон</th>
              <th scope="col">Email</th>
              <th scope="col">Дата рождения</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((row) => (
              <tr key={row.id}>
                <td>{formatId(row.id)}</td>
                <td>{row.name}</td>
                <td>{row.phone || "—"}</td>
                <td>{row.email}</td>
                <td>{formatBirth(row.date_birth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
