import { API_BASE } from "../config/api.js";

const AUTH_BASE = `${API_BASE}/api/auth`;

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

export const registerRequest = async (payload) => {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка регистрации"));
  }

  return response.json();
};

export const loginRequest = async (payload) => {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка авторизации"));
  }

  return response.json();
};

export const meRequest = async (token) => {
  const response = await fetch(`${AUTH_BASE}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка получения профиля"));
  }

  return response.json();
};

export const updateMeRequest = async (token, payload) => {
  const response = await fetch(`${AUTH_BASE}/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка обновления профиля"));
  }

  return response.json();
};

export const changePasswordRequest = async (token, payload) => {
  const response = await fetch(`${AUTH_BASE}/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ошибка смены пароля"));
  }

  return response.json();
};
