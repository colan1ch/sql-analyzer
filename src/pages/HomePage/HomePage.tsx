import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import IndexCard from '../../components/IndexCard/IndexCard';
import { listIndexes } from '../../modules/IndexesApi';
import { INDEXES_MOCK } from '../../modules/mock';
import type { Index } from '../../modules/IndexesTypes';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuredIndexes, setFeaturedIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  // Загружаем индексы с API или используем моки
  useEffect(() => {
    if (useMock) {
      setFeaturedIndexes(INDEXES_MOCK.slice(0, 6));
      setLoading(false);
    } else {
      listIndexes()
        .then((data) => {
          if (data.length > 0) {
            setFeaturedIndexes(data.slice(0, 6));
            setUseMock(false);
          } else {
            setFeaturedIndexes(INDEXES_MOCK.slice(0, 6));
            setUseMock(true);
          }
        })
        .catch(() => {
          setFeaturedIndexes(INDEXES_MOCK.slice(0, 6));
          setUseMock(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [useMock]);

  // Автопрокрутка карусели
  useEffect(() => {
    if (featuredIndexes.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredIndexes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredIndexes.length]);

  const nextSlide = () => {
    if (featuredIndexes.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % featuredIndexes.length);
  };

  const prevSlide = () => {
    if (featuredIndexes.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + featuredIndexes.length) % featuredIndexes.length);
  };

  const goToSlide = (index: number) => {
    if (featuredIndexes.length === 0) return;
    setActiveIndex(index);
  };

  return (
    <div className="home-page">
      <Header />
      <BreadCrumbs crumbs={[]} />
      <div className="main">
        <div className="frame">
          <div className="grid-container">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Сервис анализа производительности SQL-запросов
              </h1>
              <p className="welcome-subtitle">
                Оптимизируйте работу вашей базы данных с помощью интеллектуального анализа индексов
              </p>
            </div>

            {/* Карусель с карточками индексов */}
            <div className="carousel-section">
              <h2 className="carousel-title">Популярные индексы</h2>
              
              {loading ? (
                <div className="carousel-loading">Загрузка индексов...</div>
              ) : featuredIndexes.length > 0 ? (
                <div className="carousel">
                  <div className="carousel-container">
                    {/* Показываем только активный слайд */}
                    <div className="carousel-item active">
                      <IndexCard index={featuredIndexes[activeIndex]} />
                    </div>
                  </div>

                  {/* Кнопки навигации */}
                  <button className="carousel-control prev" onClick={prevSlide}>
                    ‹
                  </button>
                  <button className="carousel-control next" onClick={nextSlide}>
                    ›
                  </button>

                  {/* Индикаторы */}
                  <div className="carousel-indicators">
                    {featuredIndexes.map((_, idx) => (
                      <button
                        key={idx}
                        className={`indicator ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(idx)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-indexes-message">
                  Индексы временно недоступны
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;