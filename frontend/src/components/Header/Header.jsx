import NavButton from '../ui/NavButton.jsx';
import Button from '../ui/Button.jsx';
import ThemeSwitch from '../ui/ThemeSwitch.jsx';
import BurgerMenu from '../Nav/BurgerMenu.jsx';
import { useUserRoles } from '../../users/useUserRoles.jsx';
import { useGoToBookingForm } from '../../hooks/useGoToBookingForm.js';
import { NavLinks } from '../Nav/NavLinks.jsx';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "./Header.css";

const Header = () => {
  const { userRole } = useAuth();
  const { authButton, authIcons, modal } = useUserRoles();
  const goToBookingForm = useGoToBookingForm();
  return (
    <header>
      <div className="container header__container">

        <Link className="header__logo" to="/">
          RUSK
        </Link>

        <div className="header__nav">
          <div className="header__nav-links">
            <NavLinks authButton={authButton} />
          </div>

          <div className="header__nav-icons">
            {authIcons}
          </div>
        </div>

        <div className="header__btn-switch">
          <Button text="Бронь стола" onClick={goToBookingForm} />
          <ThemeSwitch />
        </div>

        <div className="header__burger">
          <BurgerMenu />
        </div>

      </div>
      {modal}
    </header>
  );
};

export default Header;
