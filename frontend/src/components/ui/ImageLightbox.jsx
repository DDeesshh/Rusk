import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "./ActionButton.jsx";
import "./ImageLightbox.css";

export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="image-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Фото блюда"}
    >
      <IconButton
        type="button"
        className="image-lightbox__close icon-cancel"
        onClick={onClose}
        aria-label="Закрыть"
      />
      <img
        className="image-lightbox__img"
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}
