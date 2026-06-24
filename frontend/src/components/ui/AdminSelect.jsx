import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./AdminSelect.css";

export default function AdminSelect({
  id,
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [listStyle, setListStyle] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listId = useId();

  const selected = options.find((option) => option.value === value);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 4;
    const maxListHeight = Math.min(window.innerHeight * 0.35, 192);
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 120 && spaceAbove > spaceBelow;
    const availableHeight = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(96, Math.min(maxListHeight, availableHeight - 8));

    setListStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      maxHeight,
      zIndex: 1200,
      top: openUp ? undefined : rect.bottom + gap,
      bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (nextValue) => {
    if (nextValue !== value) onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className="account-admin-select" ref={rootRef}>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className={`account-admin-select__trigger${open ? " is-open" : ""}`}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
      >
        <span className="account-admin-select__value">{selected?.label ?? "–"}</span>
        <span className="account-admin-select__arrow" aria-hidden />
      </button>

      {open ? (
        <ul
          id={listId}
          className="account-admin-select__list"
          role="listbox"
          aria-label={ariaLabel}
          style={listStyle}
        >
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`account-admin-select__option${
                  option.value === value ? " is-selected" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
