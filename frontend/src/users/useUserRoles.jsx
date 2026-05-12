import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavButton from "../components/ui/NavButton.jsx";
import { IconButton } from "../components/ui/ActionButton.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

function ClientCartNav() {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  return (
    <span className="header__cart-wrap">
      <IconButton
        type="button"
        className="icon-cart"
        onClick={() => navigate("/account?tab=cart")}
        aria-label="Корзина"
      />
      {totalQuantity > 0 ? (
        <span className="header__cart-badge">
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      ) : null}
    </span>
  );
}

/** Закрыть выезжающее меню (бургер), если оно открыто — один хук в Header и в BurgerMenu. */
const CLOSE_SIDEBAR_EVENT = "rusk-close-sidebar";

const closeSidebarDrawer = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CLOSE_SIDEBAR_EVENT));
  }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const getAge = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
};

export const useUserRoles = () => {
  const { userRole, login, logout, register } = useAuth();
  const navigate = useNavigate();
  const [currentModal, setCurrentModal] = useState(null);
  const [authError, setAuthError] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    date_birth: "",
  });

  const openLogin = (e) => {
    e?.preventDefault?.();
    closeSidebarDrawer();
    setCurrentModal("login");
  };
  const openRegister = (e) => {
    e?.preventDefault?.();
    closeSidebarDrawer();
    setCurrentModal("register");
  };
  const openMessage = () => {
    closeSidebarDrawer();
    setCurrentModal("message");
  };
  const closeModal = () => {
    setCurrentModal(null);
    setAuthError("");
    setLoginErrors({});
    setRegisterErrors({});
  };

  const handleLoginInput = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setLoginErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegisterInput = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    setRegisterErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const submitLogin = async () => {
    try {
      setAuthError("");
      const nextErrors = {};

      if (!EMAIL_REGEX.test(loginForm.email.trim())) {
        nextErrors.email = "Введите корректный email";
      }

      if (!loginForm.password) {
        nextErrors.password = "Введите пароль";
      }

      if (Object.keys(nextErrors).length > 0) {
        setLoginErrors(nextErrors);
        setAuthError("Проверьте заполнение полей");
        return;
      }

      setLoginErrors({});
      await login(loginForm);
      closeModal();
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const submitRegister = async () => {
    try {
      setAuthError("");
      const nextErrors = {};

      const normalizedForm = {
        ...registerForm,
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        phone: registerForm.phone.trim(),
      };

      if (!normalizedForm.name || normalizedForm.name.length < 2) {
        nextErrors.name = "Имя должно быть не короче 2 символов";
      }

      if (!EMAIL_REGEX.test(normalizedForm.email)) {
        nextErrors.email = "Введите корректный email";
      }

      if (!PHONE_REGEX.test(normalizedForm.phone)) {
        nextErrors.phone = "Телефон должен быть в формате +79991234567";
      }

      if (!PASSWORD_REGEX.test(normalizedForm.password)) {
        nextErrors.password = "Минимум 8 символов, буквы и цифры";
      }

      if (!normalizedForm.date_birth) {
        nextErrors.date_birth = "Укажите дату рождения";
      }

      if (getAge(normalizedForm.date_birth) < 18) {
        nextErrors.date_birth = "Регистрация доступна только с 18 лет";
      }

      if (Object.keys(nextErrors).length > 0) {
        setRegisterErrors(nextErrors);
        setAuthError("Проверьте заполнение полей");
        return;
      }

      setRegisterErrors({});
      await register(normalizedForm);
      setRegisterForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        date_birth: "",
      });
      openMessage();
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = (e) => {
    e?.preventDefault?.();
    closeSidebarDrawer();
    logout();
    navigate("/");
    setCurrentModal("loggedOut");
  };

  const authButton = (() => {
    if (userRole === "guest") {
      return <NavButton text="Войти" onClick={openLogin} to="#" />;
    }
    if (userRole === "client" || userRole === "admin") {
      return <NavButton text="Выйти" onClick={handleLogout} to="#" />;
    }
    return null;
  })();

  const authIcons = (() => {
    if (userRole === "client") {
      return (
        <>
          <IconButton className="icon-user" onClick={() => navigate("/account")} />
          <IconButton
            className="icon-saved"
            onClick={() => navigate("/account?tab=favorites")}
          />
          <ClientCartNav />
        </>
      );
    }
    if (userRole === "admin") {
      return <IconButton className="icon-user" onClick={() => navigate("/account")} />;
    }
    return null;
  })();

  const modal =
    currentModal === "login" ? (
      <Modal
        title="Войти в аккаунт"
        onClose={closeModal}
        body={
          <>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleLoginInput}
                errorText={loginErrors.email}
              />
              <Input
                name="password"
                type="password"
                placeholder="Пароль"
                value={loginForm.password}
                onChange={handleLoginInput}
                errorText={loginErrors.password}
              />
            </div>
            {authError && <p className="text-danger text-center mt-3">{authError}</p>}
            <div className="d-flex justify-content-center">
              <Button
                text="Авторизоваться"
                className="mt-5"
                onClick={submitLogin}
              />
            </div>
          </>
        }
        footer={
          <p>
            Нет аккаунта?{" "}
            <NavButton onClick={openRegister} text="Зарегистрироваться" to="#"></NavButton>
          </p>
        }
      />
    ) : currentModal === "register" ? (
      <Modal
        title="Создать аккаунт"
        onClose={closeModal}
        body={
          <>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <Input
                name="name"
                type="text"
                placeholder="Имя*"
                value={registerForm.name}
                onChange={handleRegisterInput}
                errorText={registerErrors.name}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email*"
                value={registerForm.email}
                onChange={handleRegisterInput}
                errorText={registerErrors.email}
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Телефон*"
                value={registerForm.phone}
                onChange={handleRegisterInput}
                errorText={registerErrors.phone}
              />
              <Input
                name="password"
                type="password"
                placeholder="Пароль*"
                value={registerForm.password}
                onChange={handleRegisterInput}
                errorText={registerErrors.password}
              />
              <Input
                name="date_birth"
                type="date"
                placeholder="Дата рождения*"
                value={registerForm.date_birth}
                onChange={handleRegisterInput}
                errorText={registerErrors.date_birth}
              />
            </div>
            {authError && <p className="text-danger text-center mt-3">{authError}</p>}
            <div className="d-flex justify-content-center">
              <Button
                text="Зарегистрироваться"
                className="mt-5"
                onClick={submitRegister}
              />
            </div>
          </>
        }
        footer={
          <p>
            Есть аккаунт? <NavButton onClick={openLogin} text="Войти" to="#"></NavButton>
          </p>
        }
      />
    ) : currentModal === "message" ? (
      <Modal
        title="Поздравляем!"
        onClose={closeModal}
        body={
          <>
            <p className="text-center">Ваш аккаунт был успешно создан!</p>

          </>
        }
        footer={
          <div className="d-flex justify-content-center">
            <div  className="d-flex justify-content-center">
              <Button text="Ок" onClick={closeModal} />
            </div>
          </div>
        }
      />
    ) : currentModal === "loggedOut" ? (
      <Modal
        title="Выход из аккаунта"
        onClose={closeModal}
        body={<p className="text-center">Вы вышли из аккаунта.</p>}
        footer={
          <div className="d-flex justify-content-center">
            <Button text="Ок" onClick={closeModal} />
          </div>
        }
      />
    ) : null;

  return { authButton, authIcons, modal };
};
