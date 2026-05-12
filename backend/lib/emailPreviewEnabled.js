/**
 * Превью писем в браузере:
 * - production: только при ENABLE_EMAIL_PREVIEW=true|1|yes
 * - иначе (localhost): включено по умолчанию; выключить: false|0|no|off
 */
export function isEmailPreviewEnabled() {
  const raw = String(process.env.ENABLE_EMAIL_PREVIEW ?? "").trim().toLowerCase();
  const prod = process.env.NODE_ENV === "production";

  const explicitOn = ["true", "1", "yes", "on"].includes(raw);
  const explicitOff = ["false", "0", "no", "off"].includes(raw);

  if (prod) {
    return explicitOn;
  }
  if (explicitOff) {
    return false;
  }
  return true;
}
