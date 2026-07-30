// src/mocks/indexesMock.ts
import type { Index } from './IndexesTypes';
import path_404 from '../assets/404.png';


export const INDEXES_MOCK: Index[] = [
  {
    id: 1,
    image: path_404,
    name: "Player", 
    description: "Индекс для поиска игроков по\nклубу (частые запросы по\nигрокам определенного клуба)",
    cardinality: "100",
    tableField: "Club_id",
    rowsCount: "1000",
    is_delete: false,
    isMock: true 
  },
  {
    id: 2,
    image: path_404,
    name: "Match", 
    description: "Индекс для поиска матчей по\nдате (анализ матчей за\nпериод)",
    cardinality: "85",
    tableField: "date",
    rowsCount: "500",
    is_delete: false,
    isMock: true 
  },
  {
    id: 3,
    image: path_404,
    name: "Coach", 
    description: "Индекс для поиска тренеров по клубу (поиск тренерского штаба)",
    cardinality: "45",
    tableField: "club_id",
    rowsCount: "2000",
    is_delete: false,
    isMock: true
  }
];
