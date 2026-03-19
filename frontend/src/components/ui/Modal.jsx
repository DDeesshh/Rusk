import styled from "styled-components";
import ActionButton from "./ActionButton.jsx";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  background: var(--bg-image) no-repeat center center;
  background-size: cover;
  width: 90%;      
  max-width: 640px; 
  display: flex;
  flex-direction: column;

    @media (min-width: 768px) {
    width: 90%; /* Возвращаем 90% на планшетах и выше */
  }
  
`;

const Header = styled.div`
  padding: 14px;
  background: color-mix(in srgb, var(--decorate-bg) 90%, transparent);
  box-shadow: 0 4px 18px var(--primary-color);
  display: flex;
  justify-content: space-between; /* ← ключевое изменение */
  align-items: center;
  position: relative;
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
  text-align: center;
`;

const Body = styled.div`
  padding: 30px 38px;
`;

export const Modal = ({ title, body, footer, onClose }) => {
    return (
        <Overlay>
            <ModalWrapper>
                <Header>
                    <div style={{ width: '40px' }}></div>
                    <Title>{title}</Title>
                    <ActionButton iconClass="icon-cancel" onClick={onClose} />
                </Header>

                <Body>
                    {body}
                </Body>

                <Footer>{footer}</Footer>
            </ModalWrapper>
        </Overlay>
    );
};
