import ActionButton from "./ui/ActionButton.jsx";
import Button from "./ui/Button.jsx";
import "./OrderPlacedModal.css";

export default function OrderPlacedModal({ displayNumber, onClose }) {
  return (
    <div className="order-placed-modal__overlay" role="presentation">
      <div className="order-placed-modal" role="dialog" aria-modal="true" aria-labelledby="order-placed-title">
        <header className="order-placed-modal__header">
          <span className="order-placed-modal__header-spacer" aria-hidden />
          <h2 id="order-placed-title" className="order-placed-modal__title">
            Вы оформили заказ!
          </h2>
          <ActionButton iconClass="icon-cancel" onClick={onClose} aria-label="Закрыть" />
        </header>

        <div className="order-placed-modal__glow-line" aria-hidden />

        <div className="order-placed-modal__body">
          <p className="order-placed-modal__number">№{displayNumber}</p>
          <p className="order-placed-modal__text">
            Статус заказа можно отслеживать в личном кабинете в разделе «Данные пользователя» — блок «Детали заказа».
          </p>
        </div>

        <div className="order-placed-modal__glow-line" aria-hidden />

        <footer className="order-placed-modal__footer">
          <Button text="Ок" onClick={onClose} />
        </footer>
      </div>
    </div>
  );
}
