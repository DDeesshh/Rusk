import styled from 'styled-components';

const CustButton = styled.button`
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  text-transform: uppercase; 

  font-size: ${props =>
    props.size === 'large' ? '20px' : props.size === 'compact' ? '12px' : '15px'};
  padding: ${props =>
    props.size === 'large' ? '20px 24px' : props.size === 'compact' ? '10px 12px' : '16px 23px'};
  height: ${props =>
    props.size === 'large' ? '74px' : props.size === 'compact' ? '40px' : '51px'};

  ${props => props.size === 'large' ? `
    @media (max-width: 832px) {
      font-size: 16px;
      padding: 14px 18px;
      height: 56px;
    }
  ` : ''}

  color: ${props => props.disabled ? 'var(--button-disabled)' : 'var(--primary-color)'};
  background-color: transparent;
  border: ${props => props.size === 'compact' ? '2px' : '3px'} solid var(--primary-color);

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
    border: ${props => props.size === 'compact' ? '2px' : '3px'} solid var(--secondary-color);
    color: var(--text-color);
  }
    
  
  &:disabled {
    border: ${props => props.size === 'compact' ? '2px' : '3px'} solid var(--button-disabled);
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
