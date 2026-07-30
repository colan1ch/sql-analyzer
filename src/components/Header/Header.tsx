import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import logo_path from '../../assets/logo.png';
import { logoutUser } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, username } = useSelector((state: RootState) => state.auth);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    closeMobileMenu();
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="frame-top"></div>
      <div className="logo-wrapper">
        <a href="/sql-analyzer">
          <img className="logo" src={logo_path} alt="Logo" />
        </a>
        
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
          
          {isAuthenticated && (
            <>
              <Link 
                to="/queries" 
                className={`nav-button ${location.pathname === '/queries' ? 'nav-button-active' : ''}`}
              >
                Мои запросы
              </Link>
              <Link 
                to="/profile" 
                className={`nav-button ${location.pathname === '/profile' ? 'nav-button-active' : ''}`}
              >
                Личный кабинет
              </Link>
            </>
          )}
        </nav>

        <div className="header-auth desktop-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="username">{username}</span>
              <button className="logout-button" onClick={handleLogout}>
                Выход
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Вход
              </Link>
              <Link to="/register" className="register-button">
                Регистрация
              </Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <div className={`burger-line ${isMobileMenuOpen ? 'line1' : ''}`}></div>
          <div className={`burger-line ${isMobileMenuOpen ? 'line2' : ''}`}></div>
          <div className={`burger-line ${isMobileMenuOpen ? 'line3' : ''}`}></div>
        </div>

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
          
          {isAuthenticated && (
            <>
              <Link 
                to="/queries" 
                className={`mobile-nav-button ${location.pathname === '/queries' ? 'mobile-nav-button-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Мои запросы
              </Link>
              <Link 
                to="/profile" 
                className={`mobile-nav-button ${location.pathname === '/profile' ? 'mobile-nav-button-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Личный кабинет
              </Link>
            </>
          )}

          <div className="mobile-auth">
            {isAuthenticated ? (
              <>
                <span className="mobile-username">{username}</span>
                <button className="mobile-logout-button" onClick={handleLogout}>
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-login-button" onClick={closeMobileMenu}>
                  Вход
                </Link>
                <Link to="/register" className="mobile-register-button" onClick={closeMobileMenu}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;