import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { loginUser } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (result) {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <BreadCrumbs crumbs={[
        { label: 'Вход' }
      ]} />
      
      <div className="main">
        <div className="frame">
          <div className="grid-container">
            <div className="login-form-wrapper">
              <h1 className="login-title">Вход в аккаунт</h1>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="login" className="form-label">Логин</label>
                  <input
                    type="text"
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Введите логин"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Пароль</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Введите пароль"
                    required
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Загрузка...' : 'Войти'}
                </button>
              </form>

              <div className="form-footer">
                <p>Нет аккаунта? <a href="/register" className="link">Зарегистрироваться</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;