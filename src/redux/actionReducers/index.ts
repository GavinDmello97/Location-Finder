import * as locationActionReducer from "./locationReducer";
import * as rootActionReducer from "./rootReducer";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...locationActionReducer,
  ...rootActionReducer,
};
