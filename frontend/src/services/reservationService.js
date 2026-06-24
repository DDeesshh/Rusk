import { API_BASE } from "../config/api.js";

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

export const createReservationRequest = async (payload) => {
  const response = await fetch(`${API_BASE}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка отправки заявки"));
  }

  return response.json();
};

export const applyReservationAction = async (action, token) => {
  const response = await fetch(`${API_BASE}/api/reservations/${action}/${token}`);
  const message = await response.text();

  return {
    ok: response.ok,
    message: message || (response.ok ? "Готово." : "Ссылка недействительна или устарела."),
  };
};
