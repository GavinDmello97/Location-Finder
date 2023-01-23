import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

export interface initialLocationState {
  search: string;
  submittedSearch: string;
  selectedLocation: any;
  recentSearches: string[];
  isLoading: boolean;
  results: any[];
  activeCardIndex: number | null;
}

const initialState: initialLocationState = {
  search: "",
  submittedSearch: "",
  selectedLocation: null,
  recentSearches: [],
  isLoading: false,
  results: [],
  activeCardIndex: null,
};
export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSubmittedSearch: (state, action) => {
      state.submittedSearch = action.payload;
    },
    addBulkToRecents: (state, action) => {
      if (action.payload && action.payload.length > 0) {
        var result = [...action.payload, ...state.recentSearches].splice(0, 5);
        state.recentSearches = result;
      }
    },
    addSearchToRecents: (state, action) => {
      if (
        action.payload &&
        action.payload.length > 0 &&
        !state.recentSearches.includes(action.payload)
      ) {
        var result = [action.payload, ...state.recentSearches].splice(0, 5);
        state.recentSearches = result;
        localStorage.setItem("recentSearches", JSON.stringify(result));
      }
    },
    setLoadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setActiveLocationCardIndex: (state, action) => {
      state.activeCardIndex = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSearch,
  setSubmittedSearch,
  addBulkToRecents,
  addSearchToRecents,
  setLoadingStatus,
  setResults,
  setSelectedLocation,
  setActiveLocationCardIndex,
} = locationSlice.actions;
export default locationSlice.reducer;
