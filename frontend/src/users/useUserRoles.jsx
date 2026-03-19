import { useState } from "react";
import NavButton from "../components/ui/NavButton.jsx";
import { IconButton } from "../components/ui/ActionButton.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

export const useUserRoles = ({ userRole, setUserRole }) => {
  const [currentModal, setCurrentModal] = useState(null);

  const openLogin = () => setCurrentModal("login");
  const openRegister = () => setCurrentModal("register");
  const openMessage = () => setCurrentModal("message");
  const closeModal = () => setCurrentModal(null);

  const authButton = (() => {
    if (userRole === "guest") {
      return <NavButton text="Войти" onClick={openLogin} />;
    }
    if (userRole === "client" || userRole === "admin") {
      return <NavButton text="Выйти" onClick={() => setUserRole("guest")} />;
    }
    return null;
  })();

  const authIcons = (() => {
    if (userRole === "client") {
      return (
        <>
          <IconButton className="icon-user" />
          <IconButton className="icon-saved" />
          <IconButton className="icon-cart" />
        </>
      );
    }
    if (userRole === "admin") {
      return <IconButton className="icon-user" />;
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
              <Input name="email" type="email" placeholder="Email" />
              <Input name="password" type="password" placeholder="Пароль" />
            </div>
            <div className="d-flex justify-content-center">
              <Button
                text="Авторизоваться"
                className="mt-5"
                onClick={() => {
                  setUserRole("client");
                  closeModal();
                }}
              />
            </div>
          </>
        }
        footer={
          <p>
            Нет аккаунта?{" "}
            <NavButton onClick={openRegister} text="Зарегистрироваться"></NavButton>
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
              <Input name="name" type="text" placeholder="Имя*" />
              <Input name="email" type="email" placeholder="Email*" />
              <Input name="tel" type="tel" placeholder="Телефон*" />
              <Input name="password" type="password" placeholder="Пароль*" />
            </div>
            <div className="d-flex justify-content-center">
              <Button
                text="Зарегистрироваться"
                className="mt-5"
                onClick={() => {
                  openMessage(); // открываем модалку с сообщением
                }}
              />
            </div>
          </>
        }
        footer={
          <p>
            Есть аккаунт? <NavButton onClick={openLogin} text="Войти"></NavButton>
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
    ) : null;

  return { authButton, authIcons, modal };
};
