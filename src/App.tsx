import React, { useState } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./redux/config/configureStore";
import LocationFinder from "./screens/LocationFinder/LocationFinder";

const App = (props: any) => {
  return (
    <Provider store={store}>
      <div className="App">
        <LocationFinder />
      </div>
    </Provider>
  );
};

export default App;
