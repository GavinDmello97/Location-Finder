import { createSlice } from "@reduxjs/toolkit";

export interface initialState {}

const initialState: initialState = {};
export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = rootSlice.actions;
export default rootSlice.reducer;
