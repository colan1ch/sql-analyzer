import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { api } from '../../api';
import type { RootState } from '../../store';
import './QueriesPage.css';

interface QueryItem {
  id: number;
  date_query: string;
  status: string;
  date_create: string;
  date_form: string;
  date_finish: string | null;
  creator_login: string;
  moderator_login: string | null;
  execution_time: number;
}

interface FilterParams {
  fromDate: string | null;
  toDate: string | null;
  status: string | null;
}

const QueriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isModerator } = useSelector((state: RootState) => state.auth);
  
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [filters, setFilters] = useState<FilterParams>({
    fromDate: null,
    toDate: null,
    status: null,
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const loadQueries = async (filterParams?: FilterParams) => {
    // setLoading(true);
    setError(null);
    try {
      const params = filterParams || filters;
      const query: any = {};
      
      if (params.fromDate) query['from-date'] = params.fromDate;
      if (params.toDate) query['to-date'] = params.toDate;
      if (params.status) query.status = params.status;
      
      const response = await api.queries.queriesList(query);
      setQueries((response.data || []) as QueryItem[]);
    } catch (err: any) {
      console.error('Error loading queries:', err);
      setError('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const loadTodayCount = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.queries.queriesList({
        'from-date': today,
        'to-date': today,
      });
      setTodayCount((response.data || []).length);
    } catch (err: any) {
      console.error('Error loading today count:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadQueries();
      loadTodayCount();

      // Short polling: автоматическое обновление списка запросов каждые 3 секунды
      const intervalId = setInterval(() => {
        loadQueries(filters);
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, filters]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Черновик',
      'formed': 'Сформирован',
      'rejected': 'Отклонен',
      'completed': 'Завершен',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'formed': '#d4edda',
      'rejected': '#f8d7da',
      'completed': '#d1ecf1',
    };
    return colorMap[status] || '#f5f5f5';
  };

  const handleRowClick = (queryId: number) => {
    navigate(`/query/${queryId}`);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filterType: 'fromDate' | 'toDate') => {
    const newFilters = { ...filters, [filterType]: e.target.value || null };
    setFilters(newFilters);
    loadQueries(newFilters);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, status: e.target.value || null };
    setFilters(newFilters);
    loadQueries(newFilters);
  };

  const handleApplyFilters = () => {
    loadQueries(filters);
  };

  const handleTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    const newFilters = {
      ...filters,
      fromDate: today,
      toDate: today,
    };
    setFilters(newFilters);
    loadQueries(newFilters);
  };

  const handleResetFilters = () => {
    const newFilters = { fromDate: null, toDate: null, status: null };
    setFilters(newFilters);
    loadQueries(newFilters);
  };

  const handleFinishQuery = async (queryId: number, status: 'completed' | 'rejected') => {
    try {
      setLoading(true);
      await api.queries.finishUpdate(queryId, { status });
      // Перезагрузить список запросов после успешного обновления
      loadQueries();
      setError(null);
    } catch (err: any) {
      console.error('Error updating query status:', err);
      setError(`Ошибка при ${status === 'completed' ? 'одобрении' : 'отклонении'} заявки`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="queries-page">
      <Header />
      <BreadCrumbs crumbs={[{ label: 'Мои запросы' }]} />

      <div className="main">
        <div className="frame">
          <div className="queries-container">
            <h1 className="queries-title">Мои запросы</h1>

            {/* Фильтры */}
            <div className="filters-section">
              <div className="filters-row">
                <div className="filter-group">
                  <label htmlFor="from-date">От даты:</label>
                  <input
                    id="from-date"
                    type="date"
                    value={filters.fromDate || ''}
                    onChange={(e) => handleDateFilterChange(e, 'fromDate')}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="to-date">До даты:</label>
                  <input
                    id="to-date"
                    type="date"
                    value={filters.toDate || ''}
                    onChange={(e) => handleDateFilterChange(e, 'toDate')}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="status">Статус:</label>
                  <select
                    id="status"
                    value={filters.status || ''}
                    onChange={handleStatusFilterChange}
                    className="filter-input"
                  >
                    <option value="">Все статусы</option>
                    <option value="formed">Сформирован</option>
                    <option value="completed">Завершен</option>
                    <option value="rejected">Отклонен</option>
                  </select>
                </div>
              </div>

              <div className="filters-actions">
                {/* <button className="logout-button" onClick={handleApplyFilters}>
                  Найти
                </button>
                <button className="logout-button" onClick={handleTodayFilter}>
                  Запросов за сегодня: {todayCount}
                </button>
                <button className="logout-button" onClick={handleResetFilters}>
                  Очистить
                </button> */}
              </div>
            </div>

            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : queries.length === 0 ? (
              <div className="empty">
                <p>У вас нет запросов</p>
                <button 
                  className="create-button"
                  onClick={() => navigate('/indexes')}
                >
                  Создать новый запрос
                </button>
              </div>
            ) : (
              <div className="cards-grid">
                {queries.map((query) => (
                  <div
                    key={query.id}
                    className="query-card"
                    style={{ borderLeft: `4px solid ${getStatusColor(query.status)}` }}
                  >
                    <div className="card-header">
                      <span className={`status-badge status-${query.status}`}>
                        {getStatusBadge(query.status)}
                      </span>
                      {query.status === 'formed' && isModerator && (
                        <div className="card-actions">
                          <button
                            className="action-button action-approve"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFinishQuery(query.id, 'completed');
                            }}
                          >
                            Одобрить
                          </button>
                          <button
                            className="action-button action-reject"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFinishQuery(query.id, 'rejected');
                            }}
                          >
                            Отклонить
                          </button>
                        </div>
                      )}
                    </div>

                    <div
                      className="card-content"
                      onClick={() => handleRowClick(query.id)}
                    >
                      <div className="card-row">
                        <span className="label">Дата запроса:</span>
                        <span className="value">{formatDate(query.date_query)}</span>
                      </div>
                      <div className="card-row">
                        <span className="label">Создан:</span>
                        <span className="value">{formatDateTime(query.date_create)}</span>
                      </div>
                      <div className="card-row">
                        <span className="label">Сформирован:</span>
                        <span className="value">{formatDateTime(query.date_form)}</span>
                      </div>
                      {query.date_finish && (
                        <div className="card-row">
                          <span className="label">Завершен:</span>
                          <span className="value">{formatDateTime(query.date_finish)}</span>
                        </div>
                      )}
                      <div className="card-row">
                        <span className="label">Время выполнения:</span>
                        <span className="value">{query.execution_time}ms</span>
                      </div>
                    </div>

                    <div
                      className="card-footer"
                      onClick={() => handleRowClick(query.id)}
                    >
                      <div className="card-user">
                        <span className="label">Аналитик:</span>
                        <span className="value">{query.creator_login}</span>
                      </div>
                      {query.moderator_login && (
                        <div className="card-user">
                          <span className="label">Администратор БД:</span>
                          <span className="value">{query.moderator_login}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;