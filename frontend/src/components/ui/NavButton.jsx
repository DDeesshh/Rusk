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
  cursor: pointer;
  transition: all 0.2s ease-in-out;

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