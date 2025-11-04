// src/pages/IndexesPage/IndexesPage.tsx
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Search from '../../components/Search/Search';
import IndexesList from '../../components/IndexesList/IndexesList';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { listIndexes } from '../../modules/IndexesApi';
import { INDEXES_MOCK } from '../../modules/mock'; 
import type { Index } from '../../modules/IndexesTypes';
import './IndexesPage.css';

export default function IndexesPage() {
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    if (useMock) {
      setIndexes(INDEXES_MOCK);
    } else {
      listIndexes()
        .then((data) => {
          if (data.length > 0) {
            setIndexes(data);
          } else {
            setIndexes(INDEXES_MOCK);
            setUseMock(true);
          }
        })
        .catch(() => {
          setIndexes(INDEXES_MOCK);
          setUseMock(true);
        });
    }
  }, [useMock]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filtered = await listIndexes({ name: searchName });
      
      if (filtered.length > 0) {
        setIndexes(filtered);
        setUseMock(false);
      } else {
        if (useMock) {
          const filteredMock = INDEXES_MOCK.filter(index =>
            index.name.toLowerCase().includes(searchName.toLowerCase())
          );
          setIndexes(filteredMock);
        } else {
          setIndexes([]);
        }
      }
    } catch (error) {
      const filteredMock = INDEXES_MOCK.filter(index =>
        index.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setIndexes(filteredMock);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
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
          src="src/assets/file_icon.svg" 
          alt="File" 
        />
        <div className="file-count">0</div>
      </div>
      
      <div className="main">
        <div className="frame">
          <div className="search-section">
            <Search 
              query={searchName}
              onQueryChange={setSearchName}
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
                  {searchName 
                    ? `По запросу "${searchName}" индексы не найдены` 
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