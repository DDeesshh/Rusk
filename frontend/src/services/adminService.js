import { API_BASE } from "../config/api.js";

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

const parseError = async (res, fallback) => {
  try {
    const data = await res.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

export async function fetchAdminClients(token) {
  const res = await fetch(`${API_BASE}/api/admin/clients`, {
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка загрузки клиентов"));
  return res.json();
}

export async function fetchAdminReservations(token) {
  const res = await fetch(`${API_BASE}/api/admin/reservations`, {
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка загрузки заявок"));
  return res.json();
}

export async function fetchAdminOrders(token) {
  const res = await fetch(`${API_BASE}/api/admin/orders`, {
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка загрузки заказов"));
  return res.json();
}

export async function patchAdminOrderStatus(token, orderId, status) {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось сохранить статус"));
  return res.json();
}
