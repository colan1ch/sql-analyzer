import React from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../store/slices/filtersSlice';
import './Search.css';

interface SearchProps {
  query: string;
  onSearch: () => void;
}

export default function Search({ query, onSearch }: SearchProps) {
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleQueryChange = (newQuery: string) => {
    // Диспатчим action для обновления searchQuery в Redux
    dispatch(setSearchQuery(newQuery));
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <img className='search-icon' src="/sql-analyzer/src/assets/search_icon.svg" alt="Search" />
      <input 
        type="text" 
        className="search-input" 
        placeholder="Поиск по названию индекса" 
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
      />
      <button type="submit" className="search-button">Найти</button>
    </form>
  );
}