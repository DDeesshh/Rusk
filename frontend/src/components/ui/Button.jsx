import styled from 'styled-components';

const CustButton = styled.button`
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  text-transform: uppercase; 

  font-size: ${props => props.size === 'large' ? '20px' : '15px'};
  padding: ${props => props.size === 'large' ? '20px 24px' : '16px 23px'};
  height: ${props => props.size === 'large' ? '74px' : '51px'};

  color: ${props => props.disabled ? 'var(--button-disabled)' : 'var(--primary-color)'};
  background-color: transparent;
  border: 3px solid var(--primary-color);

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;

  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--primary-color);
    color: var(--text-color);
  }

  &:active {
    background-color:var(--secondary-color);
    border: 3px solid var(--secondary-color);
    color: var(--text-color);
  }
    
  
  &:disabled {
    border: 3px solid var(--button-disabled);
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
      color: var(--button-disabled);
    }
  }
`;

export default function Button({ text, size = "small", disabled, className, onClick }) {
  return (
    <CustButton
      size={size}
      disabled={disabled}
      className={className}
      onClick={onClick}>
      {text}
    </CustButton>
  );
}
