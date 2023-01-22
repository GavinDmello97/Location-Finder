import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import rootActionReducer from "../actionReducers/rootReducer";
import locationActionReducer from "../actionReducers/locationReducer";

const middleware = [thunk];
const enhancers = [...middleware];
export const store = configureStore({
  reducer: combineReducers({
    rootActionReducer,
    locationActionReducer,
  }),
  middleware: enhancers,
});
