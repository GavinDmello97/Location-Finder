import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBulkToRecents,
  setLoadingStatus,
  setResults,
  setSearch,
  setSubmittedSearch,
} from "../../redux/actionReducers/locationReducer";
import "./LocationFinder.scss";
import Generic from "../../component/Generic";
import classNames from "classnames";
import { images } from "../../configs/config";

const LocationFinder = (props: any) => {
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
    search,
    isLoading,
    results: searchResults,
    submittedSearch,
  } = state.locationState;
  console.log(searchResults, "RESULTS");
  return (
    <div className=" col-12 d-flex flex-column flex-grow-1 location-finder-container px-3">
      <div
        className={classNames(
          "col-12  pt-3  border-bottom-1 border-dark border-opacity-100",
          isLoading ? "pb-0" : "pb-3"
        )}
      >
        <SearchBox
          searchValue={search}
          callback={(value: string) => dispatch(setSearch(value))}
        />
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
              <div className=" col-12 bg-white border-1 border-danger p-2 rounded mb-3">
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
        <div className="col-12 col-md-7 col-lg-8 bg-danger flex-grow-1">
          <p></p>
        </div>
      </div>
    </div>
  );
};

const SearchBox = ({
  searchValue = "",
  callback = () => {},
}: {
  searchValue: string;
  callback: Function;
}) => {
  const dispatch = useDispatch();
  const [isSearchFocussed, setSearchFocussed] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);

  // cleaning the location result list
  const filterSearchResults = (featureList: any[]) => {
    // filtering the list for features which belong to type == "administrative" and category === "boundary"
    var filteredList = featureList.filter(
      (feature) =>
        feature.properties.type === "administrative" &&
        feature.properties.category === "boundary"
    );

    // filtering out un-used keys to get cleaner object and reduce active memory usage
    filteredList = filteredList.map((element) => {
      const { bbox, geometry, properties } = element || {};
      const {
        category,
        display_name,
        icon,
        importance,
        osm_id,
        type,
        extratags,
      } = properties || {};

      const { population } = extratags || {};
      return {
        bbox,
        geometry,
        category,
        display_name,
        icon,
        importance,
        osm_id,
        type,
        population,
      };
    });

    return filteredList;
  };

  const getResultsFromApi = async (search: string) => {
    await dispatch(setLoadingStatus(true));

    await fetch(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=geojson&extratags=1`
    )
      .then(async (response) => response.json())
      .then(async (data) => {
        const { features } = data || {};
        await dispatch(setResults(filterSearchResults(features)));
        await dispatch(setLoadingStatus(false));
      })
      .catch((err) => console.log("err", err));
  };

  const submitSearch = () => {
    removeFocus();
    getResultsFromApi(searchValue);
    dispatch(setSubmittedSearch(searchValue));
  };

  const removeFocus = () => {
    setSearchFocussed(false);
    inputRef.current?.blur();
  };

  return (
    <div className="col-12 position-relative search-box">
      <div className=" col-12  rounded bg-white shadow-sm fa-border border-opacity-10 border-secondary d-flex align-items-center">
        <div className="flex-grow-1 d-flex px-3">
          <input
            ref={inputRef}
            onFocus={() => setSearchFocussed(true)}
            onBlur={() => setSearchFocussed(false)}
            // Add api call here
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
            type="text"
            name="name"
            placeholder="Search Location"
            className="w-100 p-1 text-decoration-none border-0 border-white flex-1 bg-white"
            onChange={(e) => callback(e.target.value)}
            value={searchValue}
          />
          {searchValue && searchValue.length > 0 && (
            <button
              className="bg-white border-0"
              onClick={() => {
                setSearchFocussed(true);
                inputRef.current?.focus();
                callback("");
              }}
            >
              <i className="fa fa-times-circle-o fa-lg text-secondary" />
            </button>
          )}
        </div>

        <button
          disabled={searchValue.length < 1}
          className={classNames(
            "p-2 px-3  text-white rounded-0 rounded-end fa-border border-opacity-100 border-primary shadow-none",
            searchValue && searchValue.length > 0
              ? "bg-primary"
              : "bg-secondary"
          )}
          onClick={() => {
            submitSearch();
          }}
        >
          Search
        </button>
      </div>
      {/* 
        Temporary filler for recent searches!
        CHANGE HERE
      */}
      {isSearchFocussed && (
        <div className="position-absolute w-100 bg-white rounded-0 rounded-bottom shadow fa-border border-top-0 border-opacity-10 border-secondary py-2">
          <SearchListCard />
          <SearchListCard />
          <SearchListCard />
          <SearchListCard />
        </div>
      )}
    </div>
  );
};

const SearchListCard = () => {
  return (
    <div className="col-12 col text-start p-2 search-recent-item px-3 ">
      <i className="fa fa-clock-o fa-lg pe-2 "></i>
      <span>My search element</span>
    </div>
  );
};

export default LocationFinder;
