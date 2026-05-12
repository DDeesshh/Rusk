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

export async function createMenuItem(token, formData) {
  const res = await fetch(`${API_BASE}/api/menu/items`, {
    method: "POST",
    headers: { ...authHeader(token) },
    body: formData,
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка создания блюда"));
  return res.json();
}

export async function updateMenuItem(token, id, formData) {
  const res = await fetch(`${API_BASE}/api/menu/items/${id}`, {
    method: "PATCH",
    headers: { ...authHeader(token) },
    body: formData,
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка обновления блюда"));
  return res.json();
}

export async function deleteMenuItem(token, id) {
  const res = await fetch(`${API_BASE}/api/menu/items/${id}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка удаления блюда"));
  return res.json();
}
