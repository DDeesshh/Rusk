import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CustNavButton = styled(Link)`
  display: inline-block;
  font-family: 'Merriweather', serif;
  font-weight: 300;
  font-size: 15px;
  text-transform: uppercase; 
  text-decoration: none;
  color: var(--text-color);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  line-height: 1.3;

  @media (max-width: 1080px) and (min-width: 992px) {
    font-size: 13px;
  }

  @media (max-width: 832px) {
    font-size: 13px;
  }

  @media (max-width: 576px) {
    font-size: 11px;
  }

  &:hover {
    color: var(--primary-color);
  }

  &:active {
    color: var(--secondary-color);
  }
`;

export default function NavButton({ text, className, onClick, to }) {
  return (
    <CustNavButton className={className} onClick={onClick} to={to}>
      {text}
    </CustNavButton>
  );
}