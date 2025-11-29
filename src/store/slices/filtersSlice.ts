import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../index";

// Тип для состояния фильтров
export interface FiltersState {
  searchQuery: string;
}

// Начальное состояние
const initialState: FiltersState = {
  searchQuery: "",
};

// Создаем слайс
const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // Action для установки поискового запроса
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
    },
    // Action для очистки фильтров
    clearFilters: (state) => {
      state.searchQuery = "";
    },
  },
});

// Экспортируем actions
export const { setSearchQuery, clearFilters } = filtersSlice.actions;

// Хук для использования searchQuery в компонентах
export const useSearchQuery = () => 
  useSelector((state: RootState) => state.search.searchQuery);

// Экспортируем reducer
export default filtersSlice.reducer;