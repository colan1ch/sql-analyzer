// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import IndexesPage from './pages/IndexesPage/IndexesPage';
import IndexPage from './pages/IndexPage/IndexPage';
import { INDEXES_MOCK } from './modules/mock';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
    // Здесь будет фильтрация индексов по query
  };

  // Фильтруем индексы по поисковому запросу
  const filteredIndexes = INDEXES_MOCK.filter(index =>
    index.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    index.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/indexes" 
          element={
            <IndexesPage 
              indexes={filteredIndexes}
              query={searchQuery}
              onSearch={handleSearch}
            />
          } 
        />
        <Route 
          path="/indexes/:id" 
          element={<IndexPage indexes={INDEXES_MOCK} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;