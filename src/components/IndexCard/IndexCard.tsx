// src/components/IndexCard/IndexCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Index } from '../../modules/IndexesTypes';
import './IndexCard.css';

interface IndexCardProps {
  index: Index;
}

const IndexCard: React.FC<IndexCardProps> = ({ index }) => {
  return (
    <div className="index-card">
      <Link to={`/indexes/${index.id}`}>
        <div className="index-name">
          <div className="index-name-text">{index.name}</div>
        </div>
        <div className="card-wrapper">
          <img className="card-image" src={'http://localhost:9000/sqlanalyzer/' + index.image} alt={index.name} />
        </div>
      </Link>
      <p className="index-description">{index.description}</p>
    </div>
  );
};

export default IndexCard;