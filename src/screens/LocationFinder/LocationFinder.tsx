import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBulkToRecents } from "../../redux/actionReducers/locationReducer";
import "./LocationFinder.scss";
import Generic from "../../component/Generic";
import classNames from "classnames";
import { images } from "../../configs/config";

import SearchBox from "./SearchBox";
import Map from "./Map";

const LocationFinder = (props: any) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  useEffect(() => {
    loadSearchesFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSearchesFromLocalStorage = async () => {
    const recentSearchesJSONString = await localStorage.getItem(
      "recentSearches"
    );
    if (recentSearchesJSONString) {
      const recentSearchJSON = JSON.parse(recentSearchesJSONString);
      dispatch(addBulkToRecents(recentSearchJSON));
    }
  };
  const dispatch = useDispatch();
  // redux state
  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const {
    isLoading,
    results: searchResults,
    submittedSearch,
  } = state.locationState;

  return (
    <div className=" col-12 d-flex flex-column flex-grow-1 location-finder-container px-3 pb-3">
      <div
        className={classNames(
          "col-12  pt-3  border-bottom-1 border-dark border-opacity-100",
          isLoading ? "pb-0" : "pb-3"
        )}
      >
        <SearchBox />
      </div>
      {isLoading && (
        <div
          className={classNames(
            "col-12 p-2 d-flex loader-container align-items-center",
            isLoading ? "show-container" : "hide-container"
          )}
        >
          <Generic.Loader size={20} />
          <em className="ps-2">Fetching data from Api...</em>
        </div>
      )}

      <div className=" col-12 row d-flex flex-column flex-md-row  flex-grow-1 ">
        <div className="col-12 col-md-5 col-lg-4 d-flex flex-column flex-wrap  ">
          {searchResults &&
            searchResults.length > 0 &&
            submittedSearch.length > 0 &&
            searchResults.map((searchElement: any) => (
              <div
                className=" col-12 bg-white border-1 border-danger p-2 rounded mb-3"
                onClick={async () => {
                  setSelectedLocation(searchElement);
                  console.log("clicked", searchElement);
                }}
              >
                <p className="fw-bold">{searchElement.display_name}</p>
                <em className="">{searchElement.type.toUpperCase()}</em>
              </div>
            ))}
          {searchResults &&
            searchResults.length <= 0 &&
            submittedSearch.length > 0 && (
              <div className="d-flex flex-column align-items-center bg-white py-3 flex-grow-1 justify-content-center">
                <img
                  src={images.no_data}
                  style={{ width: 200 }}
                  className=" img-fluid"
                />
                <p className=" fw-semibold text-center px-3 pt-3">
                  There were no results found that meet the search and follow
                  under the category of administrator.
                </p>
                <em className="fw-lighter text-center mx-4">
                  Kindly edit your search or type in something new
                </em>
              </div>
            )}

          {submittedSearch.length == 0 && (
            <div className="d-none d-md-flex flex-column align-items-center bg-white py-3 flex-grow-1 justify-content-center">
              <img
                src={images.location_search}
                style={{ width: 200 }}
                className=" img-fluid"
              />
              <p className=" fw-semibold text-center px-3 pt-3">
                Search a location
              </p>
              <p className="fw-lighter text-center px-3">
                Use the search box on top to lookup a location
              </p>
            </div>
          )}
        </div>
        <div className="col-12 col-md-7 col-lg-8  flex-grow-1 ps-md-3 ">
          <div className="leaflet-container " style={{ zIndex: 0 }}>
            <Map selectedLocation={selectedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationFinder;
