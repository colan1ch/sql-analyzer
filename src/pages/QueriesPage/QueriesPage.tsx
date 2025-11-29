import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import type { RootState } from '../../store';
import { api } from '../../api';
import './QueriesPage.css';

interface QueryItem {
  id: number;
  status: string;
  creator_login: string;
  date_create: string;
  date_query?: string;
  indexes_count: number;
  execution_time?: number;
}

const QueriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Если не авторизован, редирект на логин
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Загрузить список запросов пользователя через API
  useEffect(() => {
    const loadQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.queries.queriesList();
        if (response.data && Array.isArray(response.data)) {
          setQueries(response.data);
        } else {
          setQueries([]);
        }
      } catch (err: any) {
        console.error('Error loading queries:', err);
        setError(err.response?.data?.description || 'Ошибка загрузки запросов');
        setQueries([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadQueries();
    }
  }, [isAuthenticated]);

  const handleCreateQuery = () => {
    navigate('/indexes');
  };

  const handleQueryClick = (queryId: number) => {
    navigate(`/query/${queryId}`);
  };

  const filteredQueries = queries.filter((query) => {
    if (filterStatus === 'all') return true;
    return query.status === filterStatus;
  });

  const draftQueries = queries.filter((q) => q.status === 'draft' || q.status === 'черновик');
  const completedQueries = queries.filter((q) => q.status === 'completed' || q.status === 'завершен');

  return (
    <div className="queries-page">
      <Header />
      <BreadCrumbs crumbs={[
        { label: 'Мои запросы' }
      ]} />
      
      <div className="main">
        <div className="frame">
          <div className="page-header">
            <h1 className="page-title">Мои запросы</h1>
            <button className="create-button" onClick={handleCreateQuery}>
              + Создать новый запрос
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Фильтры */}
          <div className="filter-section">
            <div className="filter-buttons">
              <button
                className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Все ({queries.length})
              </button>
              <button
                className={`filter-button ${filterStatus === 'draft' ? 'active' : ''}`}
                onClick={() => setFilterStatus('draft')}
              >
                Черновики ({draftQueries.length})
              </button>
              <button
                className={`filter-button ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Завершены ({completedQueries.length})
              </button>
            </div>
          </div>

          {/* Список запросов */}
          {loading ? (
            <div className="loading">Загрузка запросов...</div>
          ) : filteredQueries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>Нет запросов</h2>
              <p>У вас пока нет {filterStatus === 'all' ? '' : filterStatus === 'draft' ? 'черновиков' : 'завершённых'} запросов</p>
              <button className="create-button-secondary" onClick={handleCreateQuery}>
                Создать первый запрос
              </button>
            </div>
          ) : (
            <div className="queries-grid">
              {filteredQueries.map((query) => (
                <div
                  key={query.id}
                  className="query-card"
                  onClick={() => handleQueryClick(query.id)}
                >
                  <div className="card-header">
                    <h3 className="card-title">Запрос #{query.id}</h3>
                    <span className={`status-badge ${query.status}`}>
                      {query.status === 'draft' || query.status === 'черновик' ? 'Черновик' : 'Завершен'}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="card-row">
                      <span className="card-label">Статус:</span>
                      <span className="card-value">{query.status === 'draft' || query.status === 'черновик' ? 'Черновик' : 'Завершен'}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Индексов:</span>
                      <span className="card-value">{query.indexes_count || 0}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Создано:</span>
                      <span className="card-value">{new Date(query.date_create).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {query.date_query && (
                      <div className="card-row">
                        <span className="card-label">Выполнено:</span>
                        <span className="card-value">{new Date(query.date_query).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}
                    {query.execution_time && (
                      <div className="card-row">
                        <span className="card-label">Время:</span>
                        <span className="card-value">{query.execution_time}мс</span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <button className="card-button">
                      Открыть →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;