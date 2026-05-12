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

export async function createOrder(token, payload) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось оформить заказ"));
  return res.json();
}

export async function fetchLatestOrder(token) {
  const res = await fetch(`${API_BASE}/api/orders/my/latest`, {
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось загрузить заказ"));
  return res.json();
}

export async function fetchMyOrders(token) {
  const res = await fetch(`${API_BASE}/api/orders/my`, {
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось загрузить историю заказов"));
  return res.json();
}
