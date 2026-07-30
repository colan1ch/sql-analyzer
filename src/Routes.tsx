export const ROUTES = {
  HOME: "/",
  INDEXES: "/indexes",
  INDEX: "/indexes/:id",
  QUERIES: "/queries",
  PROFILE: "/profile",
  LOGIN: "/login", 
  REGISTER: "/register",
  QUERY: "/query/:id"
}

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  INDEXES: "Индексы",
  INDEX: "Индекс",
  QUERIES: "Мои запросы",
  PROFILE: "Личный кабинет",
  LOGIN: "Вход",
  REGISTER: "Регистрация",
  QUERY: "Запрос"
};