import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { Index } from '../../modules/IndexesTypes';
import type { RootState } from '../../store';
import { api } from '../../api';
import './IndexCard.css';

interface IndexCardProps {
  index: Index;
  onAddSuccess?: () => void;
}

const IndexCard: React.FC<IndexCardProps> = ({ index, onAddSuccess }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const checkIfInCart = async () => {
      if (!isAuthenticated) {
        setIsInCart(false);
        return;
      }

      try {
        const response = await api.queries.queryCartList();
        
        if (response.data?.id && response.data.id > 0) {
          const queryDetail = await api.queries.queriesDetail(response.data.id);
          const typedDetail = queryDetail.data as any;
          
          const indexId = typeof index.id === 'string' ? parseInt(index.id) : index.id;
          const indexExists = typedDetail.indexesQuery?.some(
            (item: any) => item.index_id === indexId
          );
          
          setIsInCart(indexExists || false);
        } else {
          setIsInCart(false);
        }
      } catch (err) {
        setIsInCart(false);
      }
    };

    checkIfInCart();
  }, [isAuthenticated, index.id]);

  const getImageSrc = () => {
    if (index.isMock) {
      return index.image;
    } else {
      return 'http://localhost:9000/sqlanalyzer/' + index.image;
    }
  };

  const handleAddToQuery = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    try {
      const indexId = typeof index.id === 'string' ? parseInt(index.id) : index.id;
      await api.indexes.addToQueryCreate(indexId);
      
      const response = await api.queries.queryCartList();
      
      if (response.data?.id && response.data.id > 0) {
        const queryDetail = await api.queries.queriesDetail(response.data.id);
        const typedDetail = queryDetail.data as any;
        
        const indexExists = typedDetail.indexesQuery?.some(
          (item: any) => item.index_id === indexId
        );
        
        setIsInCart(indexExists || false);
        
        if (onAddSuccess) {
          onAddSuccess();
        }
      }
    } catch (error: any) {
      console.error('Error adding to query:', error);
      if (error.response?.status === 409) {
        setIsInCart(true);
        if (onAddSuccess) {
          onAddSuccess();
        }
      } else {
        alert('Ошибка добавления в запрос');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="index-card">
      <Link to={`/indexes/${index.id}`}>
        <div className="index-name">
          <div className="index-name-text">{index.name}</div>
        </div>
      </Link>
      
      <Link to={`/indexes/${index.id}`}>
        <div className="card-wrapper">
          <img 
            className="card-image" 
            src={getImageSrc()} 
            alt={index.name} 
          />
        </div>
      </Link>
      
      <p className="index-description">Поле таблицы: {index.table_field}</p>
      
      {isAuthenticated && (
        <button
          className={`add-button ${isInCart ? 'in-cart' : ''}`}
          onClick={handleAddToQuery}
          disabled={isAdding || isInCart}
          title={isInCart ? 'Уже в запросе' : 'Добавить в запрос'}
        >
          {isInCart ? '✓ В запросе' : 'Добавить в запрос'}
        </button>
      )}
    </div>
  );
};

export default IndexCard;