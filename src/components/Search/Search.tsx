// src/components/Search/Search.tsx
import './Search.css';

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function Search({ query, onQueryChange, onSearch }: SearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <img className='search-icon' src="src/assets/search_icon.svg"></img>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Поиск по названию индекса" 
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button type="submit" className="search-button">Найти</button>
    </form>
  );
}