import styled from "styled-components";
import { useState } from "react";
import { IconButton } from "../ui/ActionButton.jsx";
import { useUserRoles } from "../../users/useUserRoles.jsx";
import { NavLinks } from "./NavLinks";

const CustBurgerButton = styled.div`
  width: 1.875rem;
  height: 1.563rem;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  color: var(--text-color);
  display: none;
  
  div {
    height: 0.094rem;
    background-color: var(--text-color);
    transition: all 0.3s ease;
  }

  &.open div:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  &.open div:nth-child(2) {
    opacity: 0;
  }
  &.open div:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }


    @media (max-width: 991px) {
    display: flex;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: -1.25rem;
  width: 11.25rem;
  height: 100%;
  background-color: var(--decorate-bg);
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
  box-shadow: 0 6px 18px var(--primary-color);
  padding: 1.25rem 1.875rem;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
`;

const CloseButton = styled(IconButton)`
  align-self: flex-end;
  font-size: 20px;
`;

const IconsRow = styled.div`
  display: flex;
  gap: 10px;
`;

const BurgerMenu = ({ userRole, setUserRole }) => {
  const { authButton, authIcons, modal } = useUserRoles({ userRole, setUserRole });
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustBurgerButton className={open ? "open" : ""} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </CustBurgerButton>
      <Sidebar open={open}>
        <CloseButton
          className="icon-cancel"
          onClick={() => setOpen(false)}
        />
        <NavLinks authButton={authButton} />
        <IconsRow>
          {authIcons}
        </IconsRow>
      </Sidebar>
      {modal}
    </>
  );
};

export default BurgerMenu;