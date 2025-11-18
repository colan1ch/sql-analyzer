import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./slices/filtersSlice";

// Создаем и настраиваем store
const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
  // Включаем Redux DevTools в development режиме
  devTools: true,
});

// Экспортируем типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;