// src/components/IndexesList/IndexesList.tsx
import React from 'react';
import IndexCard from '../IndexCard/IndexCard';
import type { Index } from '../../modules/IndexesTypes';
import './IndexesList.css';

interface IndexesListProps {
  indexes: Index[];
  // query?: string;
  // onSearch?: (searchQuery: string) => void;
}

const IndexesList: React.FC<IndexesListProps> = ({ 
  indexes, 
}) => {
  return (
    <div className="indexes-list-container">
      {!indexes || indexes.length === 0 ? (
        <div className="not-found-message">По вашему запросу ничего не найдено</div>
      ) : (
        <div className="indexes-grid">
          {indexes.map((index) => (
            <IndexCard
              key={index.id}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IndexesList;