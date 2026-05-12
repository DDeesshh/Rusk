export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Картинки блюд лежат в `frontend/public/uploads` – грузим с того же origin, что и SPA (`/uploads/...`). */
export function mediaUrl(imgPath) {
  if (!imgPath) return "";
  const s = String(imgPath);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const path = s.replace(/^\//, "");
  if (path.startsWith("uploads/")) {
    return `/${path}`;
  }
  return `${API_BASE}/${path}`;
}
