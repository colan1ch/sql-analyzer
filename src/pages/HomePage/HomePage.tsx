import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import './HomePage.css';
import img1_path from '../../assets/img1.png';
import img2_path from '../../assets/img2.png';

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [img1_path, img2_path];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
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

            <div className="carousel">
              <button className="carousel-button carousel-button-prev" onClick={handlePrevious}>
                ‹
              </button>

              <div className="carousel-container">
                <img 
                  src={images[currentImageIndex]} 
                  alt="Carousel" 
                  className="carousel-image"
                />
              </div>

              <button className="carousel-button carousel-button-next" onClick={handleNext}>
                ›
              </button>

              <div className="carousel-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;