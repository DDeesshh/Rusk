import { useEffect, useMemo, useState } from "react";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import AccountOrderDetails from "./AccountOrderDetails.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;

export default function UserProfile({ user }) {
  const { updateProfile, userRole } = useAuth();
  const initialForm = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      date_birth: user?.date_birth ? String(user.date_birth).slice(0, 10) : "",
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(initialForm);
    setErrors({});
    setMessage("");
    setIsEditing(false);
  }, [initialForm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const handleSave = async () => {
    const nextErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Имя должно быть не короче 2 символов";
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Введите корректный email";
    }
    if (!PHONE_REGEX.test(form.phone.trim())) {
      nextErrors.phone = "Телефон должен быть в формате +79991234567";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      });
      setIsEditing(false);
      setMessage("Данные успешно сохранены");
    } catch (error) {
      setMessage(error.message || "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.name?.trim() || "Гость";

  return (
    <div className="account-profile">
      <h1 className="account__title">Здравствуйте, {displayName}!</h1>
      {userRole === "client" ?       <p className="account-profile__text">
      Здесь вы можете управлять своими данными, отслеживать историю заказов и бронирований, а также редактировать личную информацию. Все ваши действия и заявки собраны в одном месте для удобства и быстрого доступа.
      </p> : <p className="account-profile__text">
      Это административная панель, где вы можете отслеживать бронирования, заказы, отзывы и контент сайта. Все инструменты управления доступны в одном интерфейсе.</p>}


      <div className="account-profile__grid">
        <Input
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          disabled={!isEditing}
          errorText={errors.name}
        />
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={!isEditing}
          errorText={errors.email}
        />
        <Input
          name="phone"
          placeholder="Телефон"
          value={form.phone}
          onChange={handleChange}
          disabled={!isEditing}
          errorText={errors.phone}
        />
        <Input
          name="password_info"
          placeholder="Пароль"
          type="text"
          value="Для смены пароля нужен отдельный экран"
          disabled
        />
      </div>
      <div className="account-profile__birth">
        <Input
          name="date_birth"
          placeholder="Дата рождения"
          type="date"
          value={form.date_birth}
          disabled
        />
      </div>
      <p className="account-profile__hint">
        Дата рождения задается при регистрации и не редактируется.
      </p>

      <div className="account-profile__actions">
        <Button
          text={isEditing ? (isSaving ? "Сохранение..." : "Сохранить") : "Редактировать"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
        />
      </div>
      {message ? (
        <p className={`account-profile__message ${message.includes("успешно") ? "is-success" : "is-error"}`}>
          {message}
        </p>
      ) : null}

      {userRole === "client" ? <AccountOrderDetails /> : null}
    </div>
  );
}

