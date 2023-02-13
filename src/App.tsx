import React, { useState } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./redux/config/configureStore";
import LocationFinder from "./screens/LocationFinder/LocationFinder";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";

const App = (props: any) => {
  return (
    <Provider store={store}>
      <div className=" col-12">
        {/* <p className="bg-primary text-white fw-bold h3 py-2 text-wrap text-center m-0">
          Granular.ai Frontend Developer Take-Home Assignment
        </p> */}
        <Routes>
          <Route path="/" element={<LocationFinder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Provider>
  );
};

export default App;
