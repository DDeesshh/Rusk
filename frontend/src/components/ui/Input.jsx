import styled from 'styled-components';

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

const ErrorText = styled.p`
  margin: 6px 0 0;
  color: #dc3545;
  font-size: 12px;
`;

export default function Input({
  placeholder,
  className,
  type = 'text',
  size,
  name,
  value,
  onChange,
  errorText = "",
  ...rest
}) {
  const handleChange = (e) => {
    onChange && onChange(e);
  };

  return (
    <div>
      <CustInput
        className={className}
        name={name}
        placeholder={placeholder}
        type={type}
        $size={size}
        $error={Boolean(errorText)}
        onChange={handleChange}
        value={value}
        {...rest}
      />
      {errorText ? <ErrorText>{errorText}</ErrorText> : null}
    </div>
  );
}