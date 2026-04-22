const API_BASE_URL = "http://localhost:4000/api/reservations";

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

export const createReservationRequest = async (payload) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка отправки заявки"));
  }

  return response.json();
};
