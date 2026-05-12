import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IconButton } from "../ui/ActionButton.jsx";
import { useUserRoles } from "../../users/useUserRoles.jsx";
import { NavLinks } from "./NavLinks";

const CLOSE_SIDEBAR_EVENT = "rusk-close-sidebar";
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

/** Закрывает только крестиком в панели: клик по затемнению не сворачивает меню. */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: color-mix(in srgb, #000 32%, transparent);
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: -1.25rem;
  width: 11.25rem;
  height: 100%;
  max-height: 100dvh;
  background-color: var(--decorate-bg);
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
  box-shadow: 0 6px 18px var(--primary-color);
  padding: 1.25rem 1.875rem;
  box-sizing: border-box;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1002;
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  overflow: hidden;
`;

const SidebarScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CloseButton = styled(IconButton)`
  align-self: flex-end;
  font-size: 20px;
  flex-shrink: 0;
`;

const IconsRow = styled.div`
  display: flex;
  gap: 10px;
`;

const BurgerMenu = () => {
  const { authButton, authIcons, modal } = useUserRoles();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const onCloseDrawer = () => setOpen(false);
    window.addEventListener(CLOSE_SIDEBAR_EVENT, onCloseDrawer);
    return () => window.removeEventListener(CLOSE_SIDEBAR_EVENT, onCloseDrawer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {open ? <Backdrop aria-hidden="true" /> : null}
      <CustBurgerButton
        className={open ? "open" : ""}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <div />
        <div />
        <div />
      </CustBurgerButton>
      <Sidebar open={open}>
        <CloseButton
          type="button"
          className="icon-cancel"
          onClick={() => setOpen(false)}
          aria-label="Закрыть меню"
        />
        <SidebarScroll>
          <NavLinks authButton={authButton} />
          <IconsRow>{authIcons}</IconsRow>
        </SidebarScroll>
      </Sidebar>
      {modal}
    </>
  );
};

export default BurgerMenu;
