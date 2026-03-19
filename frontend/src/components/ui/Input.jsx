import styled from 'styled-components';
import { useState } from 'react';

const CustInput = styled.input`
  width: ${({ $size }) => ($size === 'large' ? '538px' : '256px')};
  color: var(--text-color);
  border: none;
  border-bottom: 1.5px solid
  ${({ $error }) => ($error ? 'red' : 'var(--text-color)')};
  padding-left: 20px;
  background-color: transparent;

  font-family: 'Marriweather', serif;
  font-weight: 600;
  font-size: 15px;
  padding-bottom: 6px;

  &:focus {
    outline: none;
    border: 1.5px solid;
    padding-top: 4px;
    ${({ $error }) => ($error ? 'red' : 'var(--text-color)')};
  }

  &::placeholder {
    color: var(--default-font-input);
  }

  &::-webkit-calendar-picker-indicator {
    filter: var(--input-icon-color);
    cursor: pointer;
  }

  @media (max-width: 600px) {
    width: ${({ $size }) => ($size === 'large' ? '300px' : '256px')};
        gap: 3.5rem;
    }
}
`;

const ErrorMessage = styled.span`
  font-family: 'Marriweather', serif;
  font-weight: 300;
  font-size: 12px;
  color: red;
  margin-top: 4px;
  display: block;
`;

export default function Input({
  placeholder,
  className,
  type = 'text',
  size,
  value,
  onChange,
}) {
  const [error, setError] = useState(false);

  const handleChange = e => {
    const val = e.target.value;
    onChange && onChange(e);

    // Валидация: если введено "111"
    if (val === '111') {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div>
      <CustInput
        className={className}
        placeholder={placeholder}
        type={type}
        $size={size}
        $error={error}
        onChange={handleChange}
        value={value}
      />
      {error && <ErrorMessage>Поле не может быть 111</ErrorMessage>}
    </div>
  );
}