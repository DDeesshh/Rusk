import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import { applyReservationAction } from "../../services/reservationService.js";

const TITLES = {
  confirm: "Бронь подтверждена",
  cancel: "Бронь отменена",
};

export default function ReservationAction({ action }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await applyReservationAction(action, token);
        if (cancelled) return;
        setModal({
          title: result.ok ? TITLES[action] : "Не удалось выполнить действие",
          message: result.message,
        });
      } catch {
        if (!cancelled) {
          setModal({
            title: "Ошибка",
            message: "Не удалось связаться с сервером. Попробуйте позже.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [action, token]);

  const closeModal = () => {
    setModal(null);
    navigate("/", { replace: true });
  };

  if (!modal) {
    return null;
  }

  return (
    <Modal
      title={modal.title}
      body={
        <p className="mb-0 text-center" style={{ lineHeight: 1.65 }}>
          {modal.message}
        </p>
      }
      footer={<Button text="Ок" onClick={closeModal} />}
      onClose={closeModal}
    />
  );
}
