import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import Header from '../../components/Header/Header';
import Search from '../../components/Search/Search';
import IndexesList from '../../components/IndexesList/IndexesList';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { listIndexes } from '../../modules/IndexesApi';
import { INDEXES_MOCK } from '../../modules/mock'; 
import { useSearchQuery } from '../../store/slices/filtersSlice';
import type { Index } from '../../modules/IndexesTypes';
import './IndexesPage.css';

export default function IndexesPage() {
  // const dispatch = useDispatch();
  
  const searchQuery = useSearchQuery();
  
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  // Функция поиска (вынесена для переиспользования)
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

  // Загрузка данных при монтировании - ТОЛЬКО ПРИ ПЕРВОЙ ЗАГРУЗКЕ
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      if (useMock) {
        // Если используем моки, фильтруем их по searchQuery (если есть)
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
          // Пытаемся загрузить с API
          const data = await listIndexes(searchQuery ? { name: searchQuery } : undefined);
          
          if (data.length > 0) {
            setIndexes(data);
            setUseMock(false);
          } else {
            // API вернуло пусто - используем моки
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
          // Ошибка API - используем моки
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
  }, []); // Пустой массив зависимостей - запускается только при монтировании

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const handleFileIconClick = () => {
    console.log('File icon clicked');
  };

  return (
    <div className="main-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: 'Все индексы' },
        ]}
      />

      {/* File Icon с количеством */}
      <div className="file-icon-wrapper" onClick={handleFileIconClick}>
        <img 
          className="file-icon" 
          src="/sql-analyzer/src/assets/file_icon.svg" 
          alt="File" 
        />
        <div className="file-count">0</div>
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
                <IndexesList indexes={indexes} />
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