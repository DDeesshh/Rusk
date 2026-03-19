import { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../../styles/icons.css';

const CustSwitch = styled.button`
  width: 48px;
  height: 23px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  background-color: ${({ $themeMode }) =>
    $themeMode === 'dark' ? 'black' : 'white'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  transition: all 0.3s ease-in-out;
  position: relative;
`;

const Circle = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: ${({ $themeMode }) =>
    $themeMode === 'dark' ? 'white' : 'black'};
  position: absolute;
  top: 3px;
  left: ${({ $themeMode }) =>
    $themeMode === 'dark' ? '3px' : 'calc(100% - 20px)'};
  transition: all 0.3s ease-in-out;
`;

const Icon = styled.span`
  font-family: 'icomoon';
  font-size: 11px; 
  color: ${({ $themeMode }) =>
    $themeMode === 'dark' ? 'white' : 'black'};
  z-index: 1;
`;

export default function ThemeSwitch() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.className =
      themeMode === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <CustSwitch onClick={toggleTheme} $themeMode={themeMode}>
      <Icon $themeMode={themeMode} className="icon-sun" />
      <Icon $themeMode={themeMode} className="icon-moon" />
      <Circle $themeMode={themeMode} />
    </CustSwitch>
  );
}
