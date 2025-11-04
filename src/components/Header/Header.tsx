// src/components/Header/Header.tsx
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <div className="header-container">
      <div className="frame-top"></div>
      <div className="logo-wrapper">
        <a href="/">
          <img className="logo" src="/src/assets/logo.png" alt="Logo" />
        </a>
      </div>
    </div>
  );
};

export default Header;