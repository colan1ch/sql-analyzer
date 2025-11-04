export const ROUTES = {
  HOME: "/",
  INDEXES: "/indexes",
  INDEX: "/indexes/:id"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  INDEXES: "Индексы",
  INDEX: "Индекс"
};