// src/pages/HomePage/HomePage.tsx
import React from 'react';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <BreadCrumbs crumbs={[]} />
      <div className="main">
        <div className="frame">
          <div className="grid-container">
            <div className="welcome-text">
              Добро пожаловать в сервис по расчету времени выполнения SQL-запросов по подключенным индексам
            </div>
            <div className="description">
              <p>Это приложение поможет вам анализировать и оптимизировать производительность индексов в вашей базе данных.</p>
              <p>Используйте навигацию для просмотра доступных индексов и управления запросами.</p>
            </div>
            <div className="actions">
              <a href="/indexes" className="action-button">
                Просмотреть индексы
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;