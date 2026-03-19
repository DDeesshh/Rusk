import styled from 'styled-components';

const CustRadioButton = styled.input.attrs({ type: 'radio' })`
  accent-color: var(--primary-color);
  width: 10px;
  height: 10px;
  cursor: pointer;
`;

const Label = styled.label`
  font-family: 'Marriweather', serif;
  font-weight: 400;
  font-size: 15px;
  color: var(--text-color);
  gap: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default function RadioButton({ label, name, value, checked, onChange, className }) {
  return (
    <Label>
      <CustRadioButton
        className={className}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </Label>
  );
}