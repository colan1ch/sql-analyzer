// src/components/Header/Header.tsx
import React from 'react';
import './Header.css';
import logo_path from '../../assets/logo.png';


const Header: React.FC = () => {
  return (
    <div className="header-container">
      <div className="frame-top"></div>
      <div className="logo-wrapper">
        <a href="/">
          <img className="logo" src={logo_path} alt="Logo" />
        </a>
      </div>
    </div>
  );
};

export default Header;