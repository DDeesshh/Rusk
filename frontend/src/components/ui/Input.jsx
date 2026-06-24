import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  birthDisplayToIso,
  getBirthDateValidationError,
  isoToBirthDisplay,
  maskBirthDateInput,
} from "../../utils/birthDateFormat.js";

const InputField = styled.div`
  position: relative;
  display: inline-block;
`;

const BirthDateWrap = styled.div`
  display: inline-flex;
  align-items: flex-end;
  gap: 6px;
`;

const DatePlaceholder = styled.span`
  position: absolute;
  left: 20px;
  bottom: 6px;
  z-index: 1;
  pointer-events: none;
  color: var(--default-font-input);
  font-family: "Merriweather", serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.35;
`;

const CustInput = styled.input`
  width: ${({ $size }) => ($size === "large" ? "538px" : "256px")};
  color: var(--text-color);
  border: none;
  border-bottom: 1.5px solid
    ${({ $error }) => ($error ? "red" : "var(--text-color)")};
  padding-left: 20px;
  background-color: transparent;

  font-family: "Merriweather", serif;
  font-weight: 600;
  font-size: 15px;
  padding-bottom: 6px;

  &:focus {
    outline: none;
    border: 1.5px solid;
    padding-top: 4px;
    ${({ $error }) => ($error ? "red" : "var(--text-color)")};
  }

  &::placeholder {
    color: var(--default-font-input);
  }

  &::-webkit-calendar-picker-indicator {
    filter: var(--input-icon-color);
    cursor: pointer;
  }

  ${({ $hideNativeDate }) =>
    $hideNativeDate &&
    css`
      color: transparent;
      caret-color: transparent;

      &::-webkit-datetime-edit,
      &::-webkit-datetime-edit-fields-wrapper,
      &::-webkit-datetime-edit-text,
      &::-webkit-datetime-edit-day-field,
      &::-webkit-datetime-edit-month-field,
      &::-webkit-datetime-edit-year-field {
        color: transparent;
        -webkit-text-fill-color: transparent;
        opacity: 0;
      }

      &::-webkit-calendar-picker-indicator {
        opacity: 1;
        cursor: pointer;
      }
    `}

  @media (max-width: 600px) {
    width: ${({ $size }) => ($size === "large" ? "300px" : "256px")};
  }
`;

/** Иконка календаря рядом с полем даты рождения — без нижней линии */
const CalendarPicker = styled.input`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin: 0 0 4px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: transparent;
  caret-color: transparent;

  &:focus {
    outline: none;
    border: none;
    padding: 0;
  }

  &::-webkit-calendar-picker-indicator {
    width: 22px;
    height: 22px;
    margin: 0;
    cursor: pointer;
    filter: var(--input-icon-color);
    opacity: 1;
  }

  &::-webkit-datetime-edit,
  &::-webkit-datetime-edit-fields-wrapper {
    display: none;
  }
`;

const ErrorText = styled.p`
  margin: 6px 0 0;
  color: #dc3545;
  font-size: 12px;
`;

function BirthDateField({
  name,
  value = "",
  onChange,
  onDisplayChange,
  errorText = "",
  size,
  label = "Дата рождения*",
  max,
  onFocus,
  onBlur,
}) {
  const [display, setDisplay] = useState(() => isoToBirthDisplay(value));
  const [focused, setFocused] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setDisplay(isoToBirthDisplay(value));
  }, [value]);

  const todayIso = max || new Date().toISOString().slice(0, 10);

  const emitChange = (iso) => {
    onChange?.({
      target: { name, value: iso || "" },
    });
  };

  const syncDisplay = (nextDisplay) => {
    setDisplay(nextDisplay);
    onDisplayChange?.(nextDisplay);
  };

  const validateDisplay = (nextDisplay) => {
    const err = getBirthDateValidationError(nextDisplay, { maxIso: todayIso });
    setLocalError(err || "");
  };

  const handleTextChange = (e) => {
    const masked = maskBirthDateInput(e.target.value);
    syncDisplay(masked);
    emitChange(birthDisplayToIso(masked));
    if (localError) {
      validateDisplay(masked);
    }
  };

  const handlePickerChange = (e) => {
    const iso = e.target.value;
    syncDisplay(isoToBirthDisplay(iso));
    emitChange(iso);
    setLocalError("");
  };

  const handleBlur = () => {
    setFocused(false);
    if (display) {
      validateDisplay(display);
    }
    onBlur?.();
  };

  const placeholder = display ? "" : focused ? "дд.мм.гг" : label;
  const shownError = errorText || localError;

  return (
    <div>
      <BirthDateWrap>
        <InputField>
          <CustInput
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="bday"
            $size={size}
            $error={Boolean(shownError)}
            value={display}
            onChange={handleTextChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-label={label}
          />
        </InputField>
        <CalendarPicker
          type="date"
          value={value || ""}
          max={todayIso}
          onChange={handlePickerChange}
          aria-label="Выбрать дату в календаре"
          title="Календарь"
        />
      </BirthDateWrap>
      {shownError ? <ErrorText>{shownError}</ErrorText> : null}
    </div>
  );
}

export default function Input({
  placeholder,
  className,
  type = "text",
  size,
  name,
  value,
  onChange,
  errorText = "",
  onFocus,
  onBlur,
  birthDate = false,
  onDisplayChange,
  label = "Дата рождения*",
  max,
  ...rest
}) {
  if (birthDate) {
    return (
      <BirthDateField
        name={name}
        value={value}
        onChange={onChange}
        onDisplayChange={onDisplayChange}
        errorText={errorText}
        size={size}
        label={label}
        max={max}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  }

  const [focused, setFocused] = useState(false);
  const isEmpty = value == null || value === "";
  const hideNativeDate = type === "date" && isEmpty && !focused;
  const showDatePlaceholder =
    type === "date" && Boolean(placeholder) && isEmpty && !focused;

  const handleChange = (e) => {
    onChange?.(e);
  };

  return (
    <div>
      <InputField>
        <CustInput
          className={className}
          name={name}
          placeholder={type === "date" ? "" : placeholder}
          type={type}
          $size={size}
          $hideNativeDate={hideNativeDate}
          $error={Boolean(errorText)}
          onChange={handleChange}
          value={value}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {showDatePlaceholder ? (
          <DatePlaceholder>{placeholder}</DatePlaceholder>
        ) : null}
      </InputField>
      {errorText ? <ErrorText>{errorText}</ErrorText> : null}
    </div>
  );
}
