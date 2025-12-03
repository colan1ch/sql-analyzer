import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../index";

export interface FiltersState {
  searchQuery: string;
}

const initialState: FiltersState = {
  searchQuery: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
    },
  },
});

export const { setSearchQuery, clearFilters } = filtersSlice.actions;

export const useSearchQuery = () => 
  useSelector((state: RootState) => state.search.searchQuery);

export default filtersSlice.reducer;