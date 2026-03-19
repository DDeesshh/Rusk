import NavButton from "../ui/NavButton.jsx";

export const NavLinks = ({ authButton }) => {
  return (
    <>
      <NavButton text="Главная" to="/" />
      <NavButton text="О нас" to="/about" />
      <NavButton text="Меню" to="/menu" />
      <NavButton text="Контакты" to="/contacts" />
      {authButton}
    </>
  );
};