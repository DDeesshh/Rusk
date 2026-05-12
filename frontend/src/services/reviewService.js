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

export async function fetchReviews() {
  const res = await fetch(`${API_BASE}/api/reviews`);
  if (!res.ok) throw new Error(await parseError(res, "Не удалось загрузить отзывы"));
  return res.json();
}

export async function createReview(token, comment) {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Не удалось отправить отзыв"));
  return res.json();
}

export async function deleteReview(token, id) {
  const res = await fetch(`${API_BASE}/api/reviews/${id}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  });
  if (res.status === 204) return;
  if (!res.ok) throw new Error(await parseError(res, "Не удалось удалить отзыв"));
}
