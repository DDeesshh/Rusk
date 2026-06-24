import NavButton from '../ui/NavButton.jsx';
import Button from '../ui/Button.jsx';
import ThemeSwitch from '../ui/ThemeSwitch.jsx';
import BurgerMenu from '../Nav/BurgerMenu.jsx';
import { useEffect, useState } from 'react';
import { useUserRoles } from '../../users/useUserRoles.jsx';
import { useGoToBookingForm } from '../../hooks/useGoToBookingForm.js';
import { NavLinks } from '../Nav/NavLinks.jsx';
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "./Header.css";

const COMPACT_BOOK_BTN_MQ = "(max-width: 991px)";

const Header = () => {
  const { userRole } = useAuth();
  const { authButton, authIcons, modal } = useUserRoles();
  const goToBookingForm = useGoToBookingForm();
  const [compactBookBtn, setCompactBookBtn] = useState(
    () => typeof window !== "undefined" && window.matchMedia(COMPACT_BOOK_BTN_MQ).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_BOOK_BTN_MQ);
    const onChange = (e) => setCompactBookBtn(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

        <div className="header__actions">
          <div className="header__book-wrap">
            <Button
              text="Бронь стола"
              size={compactBookBtn ? "compact" : "small"}
              onClick={goToBookingForm}
            />
          </div>

          <div className="header__tools">
            <ThemeSwitch />
            <div className="header__burger">
              <BurgerMenu />
            </div>
          </div>
        </div>

      </div>
      {modal}
    </header>
  );
};

export default Header;
