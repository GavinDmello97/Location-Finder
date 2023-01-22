import { createSlice } from "@reduxjs/toolkit";

export interface initialLocationState {
  search: string;
  recentSearches: string[];
}

const initialState: initialLocationState = {
  search: "",
  recentSearches: [],
};
export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    addBulkToRecents: (state, action) => {
      state.recentSearches = [
        ...action.payload,
        ...state.recentSearches,
      ].splice(0, 5);
    },
    addSearchToRecents: (state, action) => {
      state.recentSearches = [action.payload, ...state.recentSearches].splice(
        0,
        5
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearch, addBulkToRecents, addSearchToRecents } =
  locationSlice.actions;
export default locationSlice.reducer;
