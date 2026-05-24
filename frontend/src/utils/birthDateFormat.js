/** Маска ввода: только цифры, автоматически ДД.ММ.ГГГГ */
export function maskBirthDateInput(raw) {
  const digits = String(raw || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

/** ISO YYYY-MM-DD → ДД.ММ.ГГГГ */
export function isoToBirthDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).slice(0, 10).split("-");
  if (!y || !m || !d) return "";
  return `${d.padStart(2, "0")}.${m.padStart(2, "0")}.${y}`;
}

export const BIRTH_DATE_INVALID_MSG = "Введите корректную дату";

/** Полная маска ДД.ММ.ГГГГ (8 цифр) */
export function isBirthDisplayComplete(display) {
  return /^(\d{2})\.(\d{2})\.(\d{4})$/.test(String(display || "").trim());
}

/** ДД.ММ.ГГГГ → ISO или null */
export function birthDisplayToIso(display) {
  const match = String(display || "").trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * @param {string} display — значение поля ДД.ММ.ГГГГ
 * @param {{ required?: boolean, maxIso?: string }} [options]
 * @returns {string|null} текст ошибки или null
 */
export function getBirthDateValidationError(display, { required = false, maxIso } = {}) {
  const trimmed = String(display || "").trim();
  if (!trimmed) {
    return required ? "Укажите дату рождения" : null;
  }
  if (!isBirthDisplayComplete(trimmed) || !birthDisplayToIso(trimmed)) {
    return BIRTH_DATE_INVALID_MSG;
  }
  const iso = birthDisplayToIso(trimmed);
  if (maxIso && iso > maxIso) {
    return BIRTH_DATE_INVALID_MSG;
  }
  return null;
}

export function getAgeFromIso(dateString) {
  const birthDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return -1;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}
