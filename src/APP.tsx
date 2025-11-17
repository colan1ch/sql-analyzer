// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import IndexesPage from './pages/IndexesPage/IndexesPage';
import IndexPage from './pages/IndexPage/IndexPage';
// import { INDEXES_MOCK } from './modules/mock';

function App() {
  // const [searchQuery, setSearchQuery] = useState('');

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  //   console.log('Search query:', query);
  // };

  // Убираем фильтрацию здесь, так как IndexesPage сам управляет состоянием
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/indexes" 
          element={<IndexesPage />} // Убираем пропсы
        />
        <Route 
          path="/indexes/:id" 
          element={<IndexPage />} // Убираем пропсы
        />
      </Routes>
    </Router>
  );
}

export default App;