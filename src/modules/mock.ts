// src/mocks/indexesMock.ts
import type { Index } from './IndexesTypes';

export const INDEXES_MOCK: Index[] = [
  {
    id: 1,
    image: "/sql-analyzer/src/assets/404.png",
    name: "Player", 
    description: "Индекс для поиска игроков по\nклубу (частые запросы по\nигрокам определенного клуба)",
    cardinality: "100",
    tableField: "Club_id",
    rowsCount: "1000",
    is_delete: false
  },
  {
    id: 2,
    image: "/sql-analyzer/src/assets/404.png",
    name: "Match", 
    description: "Индекс для поиска матчей по\nдате (анализ матчей за\nпериод)",
    cardinality: "85",
    tableField: "date",
    rowsCount: "500",
    is_delete: false
  },
  {
    id: 3,
    image: "/sql-analyzer/src/assets/404.png",
    name: "Coach", 
    description: "Индекс для поиска тренеров по клубу (поиск тренерского штаба)",
    cardinality: "45",
    tableField: "club_id",
    rowsCount: "2000",
    is_delete: false
  }
];

// export const QUERY_INDEXES_MOCK = INDEXES_MOCK.map((index, i) => ({
//   ...index,
//   positionInQuery: i + 1,
//   cardinality: index.cardinality || "0",
//   tableField: index.tableField || "",
//   rowsCount: index.rowsCount || "0",
//   recievedRows: (parseInt(index.rowsCount || "0") * 0.1).toString()
// }));

// export const QUERY_MOCK = {
//   queryID: 1,
//   executionTime: "150",
//   receivedRows: "152"
// };