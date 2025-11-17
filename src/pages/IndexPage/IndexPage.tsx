// src/pages/IndexPage/IndexPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { getIndex } from '../../modules/IndexesApi';
import { INDEXES_MOCK } from '../../modules/mock';
import type { Index } from '../../modules/IndexesTypes';
import './IndexPage.css';

export default function IndexPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [index, setIndex] = useState<Index | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    if (!id) return;

    const numericId = parseInt(id, 10);
    
    getIndex(numericId)
      .then((data) => {
        if (data) {
          setIndex(data);
          setUseMock(false);
        } else {
          // Если API вернул null, используем мок
          const mockIndex = INDEXES_MOCK.find(idx => idx.id === numericId);
          if (mockIndex) {
            setIndex(mockIndex);
            setUseMock(true);
            useMock;
          }
        }
      })
      .catch(() => {
        // Если ошибка API, используем мок
        const mockIndex = INDEXES_MOCK.find(idx => idx.id === numericId);
        if (mockIndex) {
          setIndex(mockIndex);
          setUseMock(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-page">
        <Header />
        <BreadCrumbs crumbs={[
          { label: 'Все индексы', path: '/indexes' },
          { label: 'Загрузка...' }
        ]} />
        <div className="main">
          <div className="frame">
            <div className="grid-container">
              <div className="loading-message">Загрузка индекса...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!index) {
    return (
      <div className="product-page">
        <Header />
        <BreadCrumbs crumbs={[
          { label: 'Все индексы', path: '/indexes' },
          { label: 'Индекс не найден' }
        ]} />
        <div className="main">
          <div className="frame">
            <div className="grid-container">
              <div className="error-message">
                <h2>Индекс не найден</h2>
                <p>Запрошенный индекс с ID {id} не существует.</p>
                <button 
                  onClick={() => navigate('/indexes')} 
                  className="back-button"
                >
                  Вернуться к списку индексов
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <Header />
      <BreadCrumbs crumbs={[
        { label: 'Все индексы', path: '/indexes' },
        { label: index.name }
      ]} />
      <div className="main">
        <div className="frame">
          <div className="grid-container">
            <div className="text-wrapper">{index.name}</div>
            
            {index.image ? (
              <img 
                className="image" 
                src={index.image} 
                alt={index.name}
                onError={(e) => {
                  console.error('Failed to load image:', index.image);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="image-placeholder">
                Изображение не доступно
              </div>
            )}
            
            <p className="div">{index.description}</p>
            
            {/* <div className="index-details">
              {index.cardinality && (
                <div className="detail-item">
                  <span className="detail-label">Cardinality:</span>
                  <span className="detail-value">{index.cardinality}</span>
                </div>
              )}
              {index.tableField && (
                <div className="detail-item">
                  <span className="detail-label">Table Field:</span>
                  <span className="detail-value">{index.tableField}</span>
                </div>
              )}
              {index.rowsCount && (
                <div className="detail-item">
                  <span className="detail-label">Rows Count:</span>
                  <span className="detail-value">{index.rowsCount}</span>
                </div>
              )}
            </div>

            <div className="actions">
              <button 
                onClick={() => navigate('/indexes')} 
                className="back-button"
              >
                Назад к списку
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}