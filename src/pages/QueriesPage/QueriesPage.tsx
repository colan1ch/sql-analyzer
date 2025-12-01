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

const QueriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // ✅ Загружаем все заявки пользователя
  useEffect(() => {
    const loadQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.queries.queriesList();
        setQueries((response.data || []) as QueryItem[]);
      } catch (err: any) {
        console.error('Error loading queries:', err);
        setError('Ошибка при загрузке заявок');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadQueries();
    }
  }, [isAuthenticated]);

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Форматирование времени создания
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

  // Статус бейдж
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Черновик',
      'formed': 'Сформирована',
      'rejected': 'Отклонена',
      'completed': 'Завершена',
    };
    return statusMap[status] || status;
  };

  const handleRowClick = (queryId: number, status: string) => {
    // Черновики открываем в редакторе, остальные в просмотре
    if (status === 'draft' || status === 'черновик') {
      navigate(`/query/${queryId}`);
    } else {
      navigate(`/query/${queryId}`);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="queries-page">
      <Header />
      <BreadCrumbs crumbs={[{ label: 'Мои запросы' }]} />

      <div className="main">
        <div className="frame">
          <div className="queries-container">
            <h1 className="queries-title">Мои запросы</h1>

            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : queries.length === 0 ? (
              <div className="empty">
                <p>У вас нет заявок</p>
                <button 
                  className="create-button"
                  onClick={() => navigate('/indexes')}
                >
                  Создать новую заявку
                </button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="queries-table">
                  <thead>
                    <tr>
                      {/* <th>ID</th> */}
                      <th>Дата запроса</th>
                      <th>Статус</th>
                      <th>Создана</th>
                      <th>Оформлена</th>
                      <th>Завершена</th>
                      <th>Автор</th>
                      <th>Модератор</th>
                      <th>Время выполнения</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.map((query) => (
                      <tr 
                        key={query.id}
                        className="query-row"
                        onClick={() => handleRowClick(query.id, query.status)}
                      >
                        {/* <td className="cell-id">#{query.id}</td> */}
                        <td>{formatDate(query.date_query)}</td>
                        <td>
                          <span className={`status-badge status-${query.status}`}>
                            {getStatusBadge(query.status)}
                          </span>
                        </td>
                        <td>{formatDateTime(query.date_create)}</td>
                        <td>{formatDateTime(query.date_form)}</td>
                        <td>{formatDateTime(query.date_finish)}</td>
                        <td>{query.creator_login}</td>
                        <td>{query.moderator_login || '-'}</td>
                        <td className="cell-number">{query.execution_time}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;