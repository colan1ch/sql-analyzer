// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo_path from '../../assets/logo.png';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="header-container">
      <div className="frame-top"></div>
      <div className="logo-wrapper">
        <a href="/sql-analyzer">
          <img className="logo" src={logo_path} alt="Logo" />
        </a>
        
        {/* Десктопная навигация */}
        <nav className="header-nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-button ${location.pathname === '/' ? 'nav-button-active' : ''}`}
          >
            Главная
          </Link>
          <Link 
            to="/indexes" 
            className={`nav-button ${location.pathname === '/indexes' ? 'nav-button-active' : ''}`}
          >
            Индексы
          </Link>
        </nav>

        {/* Мобильная кнопка бургер-меню */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <div className={`burger-line ${isMobileMenuOpen ? 'line1' : ''}`}></div>
          <div className={`burger-line ${isMobileMenuOpen ? 'line2' : ''}`}></div>
          <div className={`burger-line ${isMobileMenuOpen ? 'line3' : ''}`}></div>
        </div>

        {/* Мобильное меню */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <Link 
            to="/" 
            className={`mobile-nav-button ${location.pathname === '/' ? 'mobile-nav-button-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Главная
          </Link>
          <Link 
            to="/indexes" 
            className={`mobile-nav-button ${location.pathname === '/indexes' ? 'mobile-nav-button-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Индексы
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;