import React from 'react';
import IndexCard from '../IndexCard/IndexCard';
import type { Index } from '../../modules/IndexesTypes';
import './IndexesList.css';

interface IndexesListProps {
  indexes: Index[];
  onIndexAdded?: () => void;
}

const IndexesList: React.FC<IndexesListProps> = ({ 
  indexes,
  onIndexAdded
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
              onAddSuccess={onIndexAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IndexesList;