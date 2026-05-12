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

export async function fetchFavorites(token) {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Ошибка избранного"));
  return res.json();
}

export async function fetchFavoriteIds(token) {
  const data = await fetchFavorites(token);
  return Array.isArray(data.ids) ? data.ids : [];
}

export async function addFavorite(token, menuItemId) {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ menu_item_id: menuItemId }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось добавить в избранное"));
  return res.json();
}

export async function removeFavorite(token, menuItemId) {
  const res = await fetch(`${API_BASE}/api/favorites/${menuItemId}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось убрать из избранного"));
  return res.json();
}
