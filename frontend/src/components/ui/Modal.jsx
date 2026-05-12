import styled from "styled-components";
import ActionButton from "./ActionButton.jsx";

/** Прокручиваемый слой: при зуме / низком окне вся модалка уезжает вверх–вниз, без max-height на карточке (иначе «сплющивание»). */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  box-sizing: border-box;
  min-height: 100dvh;
  padding: 12px 12px 24px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
`;

const ModalWrapper = styled.div`
  background: var(--bg-image) no-repeat center center;
  background-size: cover;
  width: min(640px, calc(100% - 8px));
  max-width: 100%;
  margin: clamp(8px, 3dvh, 28px) auto;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: min(640px, 90%);
  }
`;

const Header = styled.div`
  padding: 14px;
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
  box-shadow: 0 4px 18px var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-shrink: 0;
`;

const Title = styled.h2`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;

const Footer = styled.div`
  padding: 16px;
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
  box-shadow: 0 -4px 18px var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const Body = styled.div`
  padding: 30px 38px;
  flex-shrink: 0;
`;

export const Modal = ({ title, body, footer, onClose }) => {
  return (
    <Overlay>
      <ModalWrapper>
        <Header>
          <div style={{ width: "40px" }} aria-hidden />
          <Title>{title}</Title>
          <ActionButton iconClass="icon-cancel" onClick={onClose} aria-label="Закрыть" />
        </Header>

        <Body>{body}</Body>

        <Footer>{footer}</Footer>
      </ModalWrapper>
    </Overlay>
  );
};
