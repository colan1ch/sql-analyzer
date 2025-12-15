import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { api } from '../../api';
import type { RootState } from '../../store';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Если не авторизован, редирект на логин
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword) {
      setError('Заполните все поля');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      await api.users.profileUpdate(username!, {
        password: formData.newPassword,
      });
      
      setMessage('Пароль успешно изменён');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Header />
      <BreadCrumbs crumbs={[
        { label: 'Личный кабинет' }
      ]} />
      
      <div className="main">
        <div className="frame">
          <div className="profile-container">
            <div className="profile-header">
              <h1 className="profile-title">Личный кабинет</h1>
              <p className="profile-subtitle">Управление профилем и безопасностью</p>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <h2 className="section-title">Информация профиля</h2>
                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label">Логин:</span>
                    <span className="info-value">{username}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2 className="section-title">Смена пароля</h2>
                
                {message && (
                  <div className="success-message">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">Текущий пароль</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Введите текущий пароль"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">Новый пароль</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Введите новый пароль"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Повторите новый пароль"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? 'Загрузка...' : 'Изменить пароль'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;