import { useMemo, useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Modal } from "./ui/Modal.jsx";
import { createReservationRequest } from "../services/reservationService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;
const getWorkingHoursByDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
        return { startMinutes: 11 * 60, endMinutes: 23 * 60, label: "11:00-23:00" };
    }

    return { startMinutes: 11 * 60, endMinutes: 20 * 60, label: "11:00-20:00" };
};

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests_count: "",
  comment: "",
};

const Form = () => {
    const [form, setForm] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverMessage, setServerMessage] = useState("");
    const [successModal, setSuccessModal] = useState({ open: false, message: "" });
    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const workingHoursHint = form.date
        ? <p>Доступное время в выбранный день: {getWorkingHoursByDate(form.date).label}</p>
        : <p>Сначала выберите дату, чтобы увидеть доступное время бронирования.</p>;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerMessage("");
    };

    const validateForm = () => {
        const nextErrors = {};
        const guestsCountNumber = Number(form.guests_count);

        if (!form.name.trim() || form.name.trim().length < 2) {
            nextErrors.name = "Имя должно быть не короче 2 символов";
        }
        if (!EMAIL_REGEX.test(form.email.trim())) {
            nextErrors.email = "Введите корректный email";
        }
        if (!PHONE_REGEX.test(form.phone.trim())) {
            nextErrors.phone = "Телефон должен быть в формате +79991234567";
        }
        if (!form.date) {
            nextErrors.date = "Укажите дату";
        } else if (form.date < today) {
            nextErrors.date = "Дата не может быть в прошлом";
        }
        if (!form.time) {
            nextErrors.time = "Укажите время";
        } else if (form.date) {
            const [hours, minutes] = form.time.split(":").map(Number);
            const selectedMinutes = hours * 60 + minutes;
            const workingHours = getWorkingHoursByDate(form.date);

            if (
                Number.isNaN(hours) ||
                Number.isNaN(minutes) ||
                selectedMinutes < workingHours.startMinutes ||
                selectedMinutes > workingHours.endMinutes
            ) {
                nextErrors.time = `В выбранный день бронирование доступно только с ${workingHours.label}`;
            }
        }
        if (!Number.isInteger(guestsCountNumber) || guestsCountNumber < 1 || guestsCountNumber > 20) {
            nextErrors.guests_count = "Количество гостей: от 1 до 20";
        }
        if (form.comment.length > 1000) {
            nextErrors.comment = "Комментарий не должен превышать 1000 символов";
        }

        return nextErrors;
    };

    const handleSubmit = async () => {
        const nextErrors = validateForm();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setServerMessage("");
            const payload = {
                ...form,
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                guests_count: Number(form.guests_count),
                comment: form.comment.trim(),
            };
            const data = await createReservationRequest(payload);
            setServerMessage("");
            setSuccessModal({
                open: true,
                message:
                    data.message ||
                    "Заявка на бронь принята. Мы отправили письмо на ваш email.",
            });
            setForm(defaultForm);
            setErrors({});
        } catch (error) {
            setServerMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccessModal = () => {
        setSuccessModal({ open: false, message: "" });
    };

    return (
        <>
            {successModal.open ? (
                <Modal
                    title="Заявка принята"
                    body={
                        <p className="mb-0" style={{ lineHeight: 1.65, textAlign: "center" }}>
                            {successModal.message}
                        </p>
                    }
                    footer={<Button text="Ок" onClick={closeSuccessModal} />}
                    onClose={closeSuccessModal}
                />
            ) : null}
            <div className="d-flex flex-column gap-4 align-items-md-center" id="booking-form">
                <Input
                    name="name"
                    type="text"
                    placeholder="Имя*"
                    size="large"
                    value={form.name}
                    onChange={handleChange}
                    errorText={errors.name}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email*"
                    size="large"
                    value={form.email}
                    onChange={handleChange}
                    errorText={errors.email}
                />
                <Input
                    name="phone"
                    type="tel"
                    placeholder="Телефон*"
                    size="large"
                    value={form.phone}
                    onChange={handleChange}
                    errorText={errors.phone}
                />
                <Input
                    name="date"
                    type="date"
                    placeholder="Дата*"
                    size="large"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    errorText={errors.date}
                />
                <Input
                    name="time"
                    type="time"
                    placeholder="Время*"
                    size="large"
                    value={form.time}
                    onChange={handleChange}
                    errorText={errors.time}
                />
                <p className="mb-0 text-muted">{workingHoursHint}</p>
                <Input
                    name="guests_count"
                    type="number"
                    placeholder="Кол-во персон*"
                    size="large"
                    value={form.guests_count}
                    onChange={handleChange}
                    min={1}
                    max={20}
                    errorText={errors.guests_count}
                />
                <Input
                    name="comment"
                    type="text"
                    placeholder="Комментарий"
                    size="large"
                    value={form.comment}
                    onChange={handleChange}
                    errorText={errors.comment}
                />
            </div>

            <div className="d-flex flex-column align-items-center align-items-lg-start mt-5">
                <Button
                    text={isSubmitting ? "Отправка..." : "Отправить"}
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                />
            </div>
            {serverMessage ? (
                <p className="mt-3 text-danger">{serverMessage}</p>
            ) : null}
        </>
    );
};

export default Form;