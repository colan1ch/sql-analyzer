import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { getQueryDetail, removeFromQuery, formQuery, deleteQuery } from '../../store/slices/queriesSlice';
import type { AppDispatch, RootState } from '../../store';
import { api } from '../../api';
import './QueryPage.css';
import logo_path from '../../assets/logo.png';

interface MergedIndex {
  id: number;
  name: string;
  image?: string;
  description?: string;
  query_id?: number;
  rows_count?: number;
  received_rows?: number;
  cardinality?: number;
  table_field?: string;
  index_id?: number;
}

interface QueryDetailResponse {
  indexes: Array<{
    id: number;
    is_delete: boolean;
    image: string;
    name: string;
    description: string;
    table_field: string;
  }>;
  indexesQuery: Array<{
    id: number;
    query_id: number;
    index_id: number;
    rows_count: number;
    recieved_rows: number;
    cardinality: number;
  }>;
  query: {
    id: number;
    date_query: string;
    status: string;
    date_create: string;
    date_form: string;
    date_finish: string;
    creator_login: string;
    moderator_login: string;
    execution_time: number;
  };
}

const QueryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const { queryDetail, loading, error } = useSelector((state: RootState) => state.queries);
  const [editingIndexes, setEditingIndexes] = useState<{ [key: number]: { cardinality: string; rowsCount: string; tableField: string } }>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [savingIndexId, setSavingIndexId] = useState<number | null>(null);
  
  const [dateQuery, setDateQuery] = useState<string>('');
  const [isSavingDate, setIsSavingDate] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(getQueryDetail(parseInt(id)));
    }
  }, [id, dispatch, refreshTrigger]);

  useEffect(() => {
    if (queryDetail) {
      const typedDetail = queryDetail as unknown as QueryDetailResponse;
      setDateQuery(typedDetail.query.date_query || '');
    }
  }, [queryDetail]);

  const queryIndexes = useMemo(() => {
    if (!queryDetail) return [];

    const typedDetail = queryDetail as unknown as QueryDetailResponse;
    const { indexes, indexesQuery } = typedDetail;

    if (!Array.isArray(indexes) || !Array.isArray(indexesQuery)) {
      return [];
    }

    const queryDataMap = new Map<number, (typeof indexesQuery)[0]>();
    for (const item of indexesQuery) {
      queryDataMap.set(item.index_id, item);
    }

    return indexes.map((index) => {
      const queryData = queryDataMap.get(index.id);
      return {
        id: index.id,
        name: index.name,
        image: index.image,
        description: index.description,
        query_id: queryData?.query_id,
        rows_count: queryData?.rows_count,
        received_rows: queryData?.recieved_rows,
        cardinality: queryData?.cardinality,
        table_field: index.table_field,
        index_id: queryData?.index_id,
      };
    });
  }, [queryDetail]);

  const handleCardinalityChange = (indexId: number, value: string) => {
    setEditingIndexes((prev) => ({
      ...prev,
      [indexId]: {
        ...prev[indexId],
        cardinality: value,
      },
    }));
  };

  const handleRowsCountChange = (indexId: number, value: string) => {
    setEditingIndexes((prev) => ({
      ...prev,
      [indexId]: {
        ...prev[indexId],
        rowsCount: value,
      },
    }));
  };

  const handleTableFieldChange = (indexId: number, value: string) => {
    setEditingIndexes((prev) => ({
      ...prev,
      [indexId]: {
        ...prev[indexId],
        tableField: value,
      },
    }));
  };

  const handleSaveDateQuery = async () => {
    if (!queryDetail || !dateQuery) return;

    const typedDetail = queryDetail as unknown as QueryDetailResponse;
    setIsSavingDate(true);

    try {
      await api.queries.changeQueryUpdate(typedDetail.query.id, {
        date_query: dateQuery,
      } as any);

      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error saving date:', err);
      alert('Ошибка сохранения даты');
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleSaveIndexData = async (indexId: number) => {
    if (!queryDetail) return;

    const typedDetail = queryDetail as unknown as QueryDetailResponse;
    const editData = editingIndexes[indexId];
    
    if (!editData) return;

    setSavingIndexId(indexId);
    
    try {
      await api.indexesQuery.indexesQueryUpdate(
        indexId,
        typedDetail.query.id,
        {
          // table_field: editData.tableField || undefined,
          cardinality: editData.cardinality ? parseInt(editData.cardinality) : undefined,
          rows_count: editData.rowsCount ? parseInt(editData.rowsCount) : undefined,
        }
      );

      setRefreshTrigger(prev => prev + 1);
      
      setEditingIndexes(prev => {
        const newEditing = { ...prev };
        delete newEditing[indexId];
        return newEditing;
      });
    } catch (err) {
      console.error('Error saving index data:', err);
      alert('Ошибка сохранения данных');
    } finally {
      setSavingIndexId(null);
    }
  };

  const handleRemoveIndex = async (indexId: number) => {
    if (queryDetail) {
      const typedDetail = queryDetail as unknown as QueryDetailResponse;
      try {
        await dispatch(removeFromQuery({ indexId, queryId: typedDetail.query.id })).unwrap();
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error removing index:', err);
      }
    }
  };

  const handleFormQuery = async () => {
    if (queryDetail) {
      const typedDetail = queryDetail as unknown as QueryDetailResponse;
      try {
        await dispatch(formQuery(typedDetail.query.id)).unwrap();
        navigate('/queries');
      } catch (err) {
        console.error('Error forming query:', err);
      }
    }
  };

  const handleDeleteQuery = async () => {
    if (queryDetail) {
      setIsDeleting(true);
      const typedDetail = queryDetail as unknown as QueryDetailResponse;
      try {
        await dispatch(deleteQuery(typedDetail.query.id)).unwrap();
        navigate('/queries');
      } catch (err) {
        setIsDeleting(false);
        console.error('Error deleting query:', err);
      }
    }
  };

  if (loading && !queryDetail) {
    return (
      <div className="query-page">
        <Header />
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="query-page">
        <Header />
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  if (!queryDetail) {
    return (
      <div className="query-page">
        <Header />
        <div className="error">Запрос не найден</div>
      </div>
    );
  }

  const typedDetail = queryDetail as unknown as QueryDetailResponse;
  const isDraft = typedDetail.query.status === 'draft' || typedDetail.query.status === 'черновик';
  const totalReceivedRows = queryIndexes.reduce((sum, idx) => sum + (idx.received_rows || 0), 0);

  return (
    <div className="query-page">
      <Header />
      <BreadCrumbs crumbs={[
        { label: 'Мои запросы' },
        { label: `Запрос #${typedDetail.query.id}` }
      ]} />

      <div className="frame-5"></div>
      <div className="logo-no-bg-preview-wrapper">
        <a href="/">
          <img className="logo-no-bg-preview" src={logo_path} alt="Logo" />
        </a>
      </div>

      <div className="cardinality-wrapper">
        <div className="date-query-field">
          <label htmlFor="date-query" className="cardinality-label">Дата запроса:</label>
          <input
            id="date-query"
            type="date"
            className="input-date-query"
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
            disabled={!isDraft || isSavingDate}
          />
          {isDraft && (
            <button 
              className="confirm-date-button" 
              onClick={handleSaveDateQuery}
              disabled={isSavingDate}
            >
              {isSavingDate ? 'Сохранение...' : 'Подтвердить'}
            </button>
          )}
        </div>

        <div className="cardinality">
          Время выполнения: {typedDetail.query.execution_time || 0} мс.
        </div>
        <div className="cardinality">
          Полученных строк: {totalReceivedRows}
        </div>
        {isDraft && (
          <div className="button-group">
            <button className="submit-button" onClick={handleFormQuery}>
              Оформить
            </button>
            <button className="delete-button" onClick={handleDeleteQuery} disabled={isDeleting}>
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        )}
      </div>

      <div className="frame-6-wrapper">
        <div className="frame-6">
          <div className="header-col header-col-1">Индекс</div>
          <div className="header-col header-col-2">Поле таблицы</div>
          <div className="header-col header-col-3">Cardinality</div>
          <div className="header-col header-col-4">Кол-во строк в таблице</div>
          <div className="header-col header-col-5">Полученных строк</div>
          <div className="header-col header-col-6">Действия</div>
        </div>
      </div>

      <div className="main">
        <div className="frame">
          <div className="grid-container">
            {queryIndexes && queryIndexes.length > 0 ? (
              queryIndexes.map((index: MergedIndex, idx: number) => (
                <div key={`${index.id}-${idx}`} className="query-row">
                  <div className="row-col row-col-1">
                    {index.image && (
                      <img 
                        className="index-image" 
                        src={index.image.startsWith('http') ? index.image : `/images/${index.image}`} 
                        alt={index.name} 
                      />
                    )}
                    <div className="index-info">
                      <div className="index-number">{idx + 1}.</div>
                      <div className="index-name">{index.name}</div>
                    </div>
                  </div>

                  <div className="row-col row-col-2">
                    <div className="input-text-2">{index.table_field || ''}</div>
                      {/* // onChange={(e) => handleTableFieldChange(index.id, e.target.value)}
                      // onKeyPress={(e) => {
                      //   if (e.key === 'Enter') {
                      //     handleSaveIndexData(index.id);
                      //   }
                      // }}
                      // disabled={!isDraft || savingIndexId === index.id}
                      // placeholder="-"
                    /> */}
                  </div>

                  <div className="row-col row-col-3">
                    <input
                      type="text"
                      className="input-text"
                      value={editingIndexes[index.id]?.cardinality || index.cardinality || ''}
                      onChange={(e) => handleCardinalityChange(index.id, e.target.value)}
                      disabled={!isDraft || savingIndexId === index.id}
                      placeholder="-"
                    />
                  </div>

                  <div className="row-col row-col-4">
                    <input
                      type="text"
                      className="input-text"
                      value={editingIndexes[index.id]?.rowsCount || index.rows_count || ''}
                      onChange={(e) => handleRowsCountChange(index.id, e.target.value)}
                      disabled={!isDraft || savingIndexId === index.id}
                      placeholder="-"
                    />
                  </div>

                  <div className="row-col row-col-5">
                    <span className="row-value">{index.received_rows !== undefined ? index.received_rows : 0}</span>
                  </div>

                  <div className="row-col row-col-6">
                    {isDraft && (
                      <button
                        className="confirm-button"
                        onClick={() => handleSaveIndexData(index.id)}
                        disabled={savingIndexId === index.id}
                        title="Подтвердить"
                      >
                        {savingIndexId === index.id ? 'Сохранение...' : 'Подтвердить'}
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveIndex(index.id)}
                      style={!isDraft ? { visibility: 'hidden' } : {}}
                      title="Удалить индекс"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-message">Индексы не добавлены</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryPage;