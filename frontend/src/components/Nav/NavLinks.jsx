import NavButton from "../ui/NavButton.jsx";

export const NavLinks = ({ authButton, onLinkClick }) => {
  return (
    <>
      <NavButton text="Главная" to="/" onClick={onLinkClick} />
      <NavButton text="О нас" to="/about" onClick={onLinkClick} />
      <NavButton text="Меню" to="/menu" onClick={onLinkClick} />
      <NavButton text="Контакты" to="/contacts" onClick={onLinkClick} />
      {authButton}
    </>
  );
};