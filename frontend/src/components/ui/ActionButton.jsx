import styled from 'styled-components';
import '../../styles/icons.css';

// с кругом
const CustActionButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: var(--add-color); // круг
  border-radius: 50%;
  border: none;
`;

const Icon = styled.span`
  font-family: 'icomoon';
  speak: never;
  color: var(--text-color);
  font-size: ${props => props.size || '16px'};
`;

// без
export const IconButton = styled.button`
  font-family: 'icomoon';
  speak: never;
  border: none;
  background: none;
  padding: 0;
  color: var(--text-color);
  font-size: ${props => props.size || '20px'};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: var(--primary-color);
  }

  &:active {
    color: var(--secondary-color);
  }
`;

export default function ActionButton({ iconClass = 'icon-add', className, onClick, size }) {
  return (
    <CustActionButton className={className} onClick={onClick}>
      <Icon className={iconClass} size={size} />
    </CustActionButton>
  );
}

