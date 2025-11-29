import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Search from '../../components/Search/Search';
import IndexesList from '../../components/IndexesList/IndexesList';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { listIndexes, getQueryCart } from '../../modules/IndexesApi';
import { INDEXES_MOCK } from '../../modules/mock'; 
import { useSearchQuery } from '../../store/slices/filtersSlice';
import type { Index } from '../../modules/IndexesTypes';
import './IndexesPage.css';
import file_icon_path from '../../assets/file_icon.svg';

export default function IndexesPage() {
  const navigate = useNavigate();
  const searchQuery = useSearchQuery();
  
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [queryId, setQueryId] = useState<number | null>(null);

  // ✅ Функция для загрузки данных корзины
  const loadCartData = async () => {
    const cart = await getQueryCart();
    setCartCount(cart.indexes_count);
    setQueryId(cart.id);
  };

  useEffect(() => {
    loadCartData();
  }, []);

  // ✅ Обработчик когда индекс добавлен
  const handleIndexAdded = () => {
    loadCartData();
  };

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const filtered = await listIndexes({ name: query });
      
      if (filtered.length > 0) {
        setIndexes(filtered);
        setUseMock(false);
      } else {
        if (useMock) {
          const filteredMock = INDEXES_MOCK.filter(index =>
            index.name.toLowerCase().includes(query.toLowerCase())
          );
          setIndexes(filteredMock);
        } else {
          setIndexes([]);
        }
      }
    } catch (error) {
      const filteredMock = INDEXES_MOCK.filter(index =>
        index.name.toLowerCase().includes(query.toLowerCase())
      );
      setIndexes(filteredMock);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      if (useMock) {
        if (searchQuery) {
          const filteredMock = INDEXES_MOCK.filter(index =>
            index.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setIndexes(filteredMock);
        } else {
          setIndexes(INDEXES_MOCK);
        }
        setLoading(false);
      } else {
        try {
          const data = await listIndexes(searchQuery ? { name: searchQuery } : undefined);
          
          if (data.length > 0) {
            setIndexes(data);
            setUseMock(false);
          } else {
            if (searchQuery) {
              const filteredMock = INDEXES_MOCK.filter(index =>
                index.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              setIndexes(filteredMock);
            } else {
              setIndexes(INDEXES_MOCK);
            }
            setUseMock(true);
          }
        } catch (error) {
          if (searchQuery) {
            const filteredMock = INDEXES_MOCK.filter(index =>
              index.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setIndexes(filteredMock);
          } else {
            setIndexes(INDEXES_MOCK);
          }
          setUseMock(true);
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const handleFileIconClick = () => {
    if (cartCount > 0 && queryId) {
      navigate(`/query/${queryId}`);
    }
  };

  return (
    <div className="main-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: 'Все индексы' },
        ]}
      />

      <div 
        className={`file-icon-wrapper ${cartCount > 0 ? 'active' : 'disabled'}`}
        onClick={handleFileIconClick}
        title={cartCount > 0 ? 'Перейти к запросу' : 'Нет индексов в запросе'}
      >
        <img 
          className="file-icon" 
          src={file_icon_path} 
          alt="File" 
        />
        <div className="file-count">{cartCount}</div>
      </div>
      
      <div className="main">
        <div className="frame">
          <div className="search-section">
            <Search 
              query={searchQuery}
              onSearch={handleSearch}
            />
          </div>

          {loading ? (
            <div className="loading-message">Загрузка...</div>
          ) : (
            <div className="indexes-grid-container">
              {indexes.length > 0 ? (
                <IndexesList 
                  indexes={indexes}
                  onIndexAdded={handleIndexAdded}
                />
              ) : (
                <div className="no-indexes">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" индексы не найдены` 
                    : 'Индексы не найдены'
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}