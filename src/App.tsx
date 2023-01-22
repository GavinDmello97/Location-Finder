import React, { useState } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./redux/config/configureStore";
import LocationFinder from "./screens/LocationFinder/LocationFinder";

const App = (props: any) => {
  return (
    <Provider store={store}>
      <div className="App">
        <p className="bg-primary text-white fw-bold h3 py-2 text-wrap text-center">
          Granular.ai Frontend Developer Take-Home Assignment
        </p>
        <LocationFinder />
      </div>
    </Provider>
  );
};

export default App;
