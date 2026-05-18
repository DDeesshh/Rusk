import { useEffect, useMemo, useState } from "react";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import AccountOrderDetails from "./AccountOrderDetails.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const emptyPasswordForm = () => ({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

export default function UserProfile({ user }) {
  const { updateProfile, changePassword, userRole } = useAuth();
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
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(initialForm);
    setPasswordForm(emptyPasswordForm());
    setErrors({});
    setPasswordErrors({});
    setMessage("");
    setIsEditing(false);
  }, [initialForm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const validatePasswordChange = () => {
    const { currentPassword, newPassword, newPasswordConfirm } = passwordForm;
    const wantsChange =
      currentPassword.trim() || newPassword.trim() || newPasswordConfirm.trim();

    if (!wantsChange) {
      return true;
    }

    const nextErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword = "Введите текущий пароль";
    }
    if (!newPassword) {
      nextErrors.newPassword = "Введите новый пароль";
    } else if (!PASSWORD_REGEX.test(newPassword)) {
      nextErrors.newPassword = "Минимум 8 символов, буквы и цифры";
    }
    if (!newPasswordConfirm) {
      nextErrors.newPasswordConfirm = "Повторите новый пароль";
    } else if (newPassword !== newPasswordConfirm) {
      nextErrors.newPasswordConfirm = "Пароли не совпадают";
    }

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      return false;
    }

    return true;
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

    if (!validatePasswordChange()) {
      return;
    }

    const wantsPasswordChange = Boolean(
      passwordForm.currentPassword.trim() ||
        passwordForm.newPassword.trim() ||
        passwordForm.newPasswordConfirm.trim()
    );

    try {
      setIsSaving(true);
      setMessage("");

      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      });

      if (wantsPasswordChange) {
        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
      }

      setPasswordForm(emptyPasswordForm());
      setIsEditing(false);
      setMessage(
        wantsPasswordChange
          ? "Данные и пароль успешно сохранены"
          : "Данные успешно сохранены"
      );
    } catch (error) {
      setMessage(error.message || "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(initialForm);
    setPasswordForm(emptyPasswordForm());
    setErrors({});
    setPasswordErrors({});
    setMessage("");
    setIsEditing(false);
  };

  const displayName = user?.name?.trim() || "Гость";

  return (
    <div className="account-profile">
      <h1 className="account__title">Здравствуйте, {displayName}!</h1>
      {userRole === "client" ? (
        <p className="account-profile__text">
          Здесь вы можете управлять своими данными, отслеживать историю заказов и
          бронирований, а также редактировать личную информацию. Все ваши действия
          и заявки собраны в одном месте для удобства и быстрого доступа.
        </p>
      ) : (
        <p className="account-profile__text">
          Это административная панель, где вы можете отслеживать бронирования,
          заказы, отзывы и контент сайта. Все инструменты управления доступны в одном
          интерфейсе.
        </p>
      )}

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

      {isEditing ? (
        <>
          <p className="account-profile__hint account-profile__hint--password mt-4">
            Чтобы сменить пароль, заполните все три поля ниже. Если пароль менять не
            нужно – оставьте их пустыми.
          </p>
          <div className="account-profile__password-grid">
            <Input
              name="currentPassword"
              placeholder="Текущий пароль"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              errorText={passwordErrors.currentPassword}
            />
            <Input
              name="newPassword"
              placeholder="Новый пароль"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              errorText={passwordErrors.newPassword}
            />
            <div className="account-profile__password-confirm">
              <Input
                name="newPasswordConfirm"
                placeholder="Повторите новый пароль"
                type="password"
                value={passwordForm.newPasswordConfirm}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                errorText={passwordErrors.newPasswordConfirm}
              />
            </div>
          </div>
        </>
      ) : null}

      <div className="account-profile__actions">
        {isEditing ? (
          <>
            <Button
              text={isSaving ? "Сохранение..." : "Сохранить"}
              onClick={handleSave}
              disabled={isSaving}
            />
            <Button text="Отмена" onClick={handleCancelEdit} disabled={isSaving} />
          </>
        ) : (
          <Button text="Редактировать" onClick={() => setIsEditing(true)} />
        )}
      </div>
      {message ? (
        <p
          className={`account-profile__message ${
            message.includes("успешно") ? "is-success" : "is-error"
          }`}
        >
          {message}
        </p>
      ) : null}

      {userRole === "client" ? <AccountOrderDetails /> : null}
    </div>
  );
}
