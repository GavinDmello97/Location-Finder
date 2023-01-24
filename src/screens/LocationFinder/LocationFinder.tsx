// packages
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";

// css
import "./LocationFinder.scss";

// store
import {
  addBulkToRecents,
  setLinkParams,
  setLoadingStatus,
  setResults,
  setSearch,
  setSelectedLocation,
  setSubmittedSearch,
} from "../../redux/actionReducers/locationReducer";

// asset imports
import { images } from "../../configs/imports";

// components
import Generic from "../../component/Generic";
import SearchBox from "./SearchBox";
import Map from "./Map";
import { apiCaller } from "../../configs/apiCallers";
import { filterSearchResults } from "../../configs/utils";
import LocationHeader from "./LocationHeader";

const LocationFinder = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({});

  // redux state
  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const {
    isLoading,
    results: searchResults,
    submittedSearch,
    selectedLocation,
  } = state.locationState;

  useEffect(() => {
    loadSearchesFromLocalStorage();
    dispatch(setLinkParams(searchParams));
    const search = searchParams.get("search");
    if (search) {
      loadFromParams(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFromParams = async (search: string) => {
    await dispatch(setSearch(search));
    await dispatch(setSubmittedSearch(search));

    var results = await getResultsFromApi(search);
    await dispatch(setResults(results));

    const selectedLocationOSMId = searchParams.get("activeLocation");
    if (selectedLocationOSMId) {
      var selectedLocation = results.filter(
        (x: any) => x.place_id.toString() === selectedLocationOSMId
      );
      if (selectedLocation && selectedLocation.length > 0) {
        await dispatch(setSelectedLocation(selectedLocation[0]));
      } else {
        await dispatch(setSelectedLocation(results[0]));
      }
    }
  };

  const getResultsFromApi = async (search: string) => {
    await dispatch(setLoadingStatus(true));
    var features = await apiCaller(search);
    const filteredData = filterSearchResults(features);
    await dispatch(setLoadingStatus(false));
    return filteredData;
  };

  const loadSearchesFromLocalStorage = async () => {
    const recentSearchesJSONString = await localStorage.getItem(
      "recentSearches"
    );
    if (recentSearchesJSONString) {
      const recentSearchJSON = JSON.parse(recentSearchesJSONString);
      dispatch(addBulkToRecents(recentSearchJSON));
    }
  };

  return (
    <div className="  mx-0 col-12 d-flex flex-column location-finder-container px-3 pb-3 position-relative">
      <LocationHeader />

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

      <div className=" col-12 row m-0 d-flex flex-column flex-md-row  flex-grow-1 ">
        <div className="col-12 col-md-5 col-lg-4 d-flex flex-column flex-wrap ps-0 pe-0 pe-md-3 ">
          {searchResults &&
            searchResults.length > 0 &&
            submittedSearch.length > 0 && (
              <div className="col-12 p-0 m-0">
                <LocationList data={searchResults} />
              </div>
            )}
          {!isLoading &&
            searchResults &&
            searchResults.length <= 0 &&
            submittedSearch.length > 0 && <NoMatchingResults />}

          {submittedSearch.length === 0 && <NoSearchYet />}
        </div>
        <div
          className="col-12 col-md-7 col-lg-8  flex-grow-1 p-0 sticky-top  "
          style={{ height: "80vh" }}
        >
          <div className="leaflet-container " style={{ zIndex: 0 }}>
            <Map selectedLocation={selectedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

const NoSearchYet = () => {
  return (
    <div className="d-none d-md-flex flex-column align-items-center bg-white py-3 flex-grow-1 justify-content-center ">
      <img
        className="helper-image img-fluid"
        src={images.location_search}
        alt="search location"
      />
      <p className=" fw-semibold text-center px-3 pt-3 m-0 noselect">
        Search a location
      </p>
      <p className="fw-lighter text-center px-3 noselect">
        Use the search box on top to lookup a location
      </p>
    </div>
  );
};

const NoMatchingResults = () => {
  return (
    <div className="d-flex flex-column align-items-center bg-white py-3 flex-grow-1 justify-content-center">
      <img
        src={images.no_data}
        style={{ width: 200 }}
        className=" helper-image img-fluid"
        alt=""
      />
      <p className=" fw-semibold text-center px-3 pt-3 m-0 noselect">
        There were no results found that meet the search and follow under the
        category of administrator.
      </p>
      <p className="fw-lighter text-center px-3 noselect">
        Kindly edit your search or type in something new
      </p>
    </div>
  );
};

const LocationList = ({ data = [] }: { data: any[] }) => {
  return (
    <div className="col-12">
      {data.map((searchElement: any, index: number) => (
        <LocationCard key={index} location={searchElement} />
      ))}
    </div>
  );
};

const LocationCard = ({ location }: { location: any }) => {
  const dispatch = useDispatch();

  // redux state
  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const { selectedLocation, linkParams } = state.locationState;
  const [searchParams, setSearchParams] = useSearchParams(linkParams);

  return (
    <div
      className={classNames(
        " col-12 border-1 border-danger m-0 p-3 rounded mb-3 location-card",
        selectedLocation && selectedLocation.place_id === location.place_id
          ? "location-card-selected"
          : ""
      )}
      onClick={async () => {
        dispatch(setSelectedLocation(location));
        linkParams.set("activeLocation", location.place_id);
        await dispatch(setLinkParams(linkParams));
        setSearchParams(linkParams);
      }}
    >
      <p className="col-12 fw-bold m-0 noselect">{location.display_name}</p>
      <p className="text-secondary m-0 noselect" style={{ fontSize: 12 }}>
        {location.type.toUpperCase()}
      </p>

      <div
        className={classNames(
          "col-12",
          selectedLocation && selectedLocation.place_id === location.place_id
            ? "location-card-additional-info-show"
            : "d-none",
          "mt-2"
        )}
      >
        <p className="m-0 noselect" style={{ fontSize: 14 }}>
          <span className="fw-semibold">Population:</span> {location.population}
        </p>
        <p className="m-0 noselect" style={{ fontSize: 14 }}>
          <span className="fw-semibold">Population Recorded Date:</span>{" "}
          {location.population_date}
        </p>
      </div>
    </div>
  );
};
export default LocationFinder;
