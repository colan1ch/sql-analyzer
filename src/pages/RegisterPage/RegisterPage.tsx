import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { registerUser } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    passwordConfirm: '',
  });

  const [validationError, setValidationError] = useState('');

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
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      setValidationError('Пароли не совпадают');
      return;
    }

    try {
      await dispatch(registerUser({
        login: formData.login,
        password: formData.password,
      })).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="register-page">
      <Header />
      <BreadCrumbs crumbs={[
        { label: 'Регистрация' }
      ]} />
      
      <div className="main">
        <div className="frame">
          <div className="grid-container">
            <div className="register-form-wrapper">
              <h1 className="register-title">Создать аккаунт</h1>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {validationError && (
                <div className="error-message">
                  {validationError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="register-form">
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

                <div className="form-group">
                  <label htmlFor="passwordConfirm" className="form-label">Подтверждение пароля</label>
                  <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Повторите пароль"
                    required
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
              </form>

              <div className="form-footer">
                <p>Уже есть аккаунт? <a href="/login" className="link">Войти</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;