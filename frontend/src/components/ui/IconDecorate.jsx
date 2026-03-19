import styled from 'styled-components';
import '../../styles/icons.css';

// с кругом
const CustIconDecorate = styled.div`
  width: 50px;
  height: 50px;
  background-color: var(--primary-color); // круг
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

 export const Icon = styled.span`
  font-family: 'icomoon';
  speak: never;
  color: ${props => props.color || 'var(--add-color)'};
  font-size: ${props => props.size || '20px'};
`;

// без

export default function IconDecorate({ iconClass = 'icon-add', className, size, color }) {
    return (
    <CustIconDecorate className={className}>
      <Icon className={iconClass} size={size} color={color} />
    </CustIconDecorate>
    );
}