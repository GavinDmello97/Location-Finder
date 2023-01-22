import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBulkToRecents,
  setSearch,
} from "../../redux/actionReducers/locationReducer";
import "./LocationFinder.scss";

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
    console.log(state);
    return { locationState: state.locationActionReducer };
  });
  const { search } = state.locationState;
  return (
    <div className=" col-12 d-flex flex-column flex-grow-1 ">
      <div className="col-12 p-2 border-bottom-1 border-dark border-opacity-100">
        <SearchBox
          searchValue={search}
          callback={(value: string) => dispatch(setSearch(value))}
        />
      </div>
      <div className=" col-12 row d-flex flex-column flex-md-row bg-black flex-grow-1 ">
        <div className="col-12 col-md-5 col-lg-4  p-2  bg-white">
          <p></p>
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
  const [isSearchFocussed, setSearchFocussed] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);
  return (
    <div className="col-12 position-relative search-box">
      <div className=" col-12  rounded bg-white shadow-sm fa-border border-opacity-10 border-secondary d-flex align-items-center">
        <div className="flex-grow-1 d-flex px-3">
          <input
            ref={inputRef}
            onFocus={() => setSearchFocussed(true)}
            onBlur={() => setSearchFocussed(false)}
            // Add api call here
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (setSearchFocussed(false), inputRef.current?.blur())
            }
            onSubmit={() => {}}
            type="text"
            name="name"
            placeholder="Search Location"
            className="w-100 p-1  text-decoration-none border-0 border-white flex-1 bg-white"
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
          className="p-2 px-3 bg-primary text-white rounded-0 rounded-end fa-border border-opacity-100 border-primary shadow-none"
          onClick={() => {
            setSearchFocussed(false);
            inputRef.current?.blur();
            // Add api call here
          }}
        >
          Search
        </button>
      </div>
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
    <div
      className="col-12 col text-start p-2 search-recent-item px-3 "
      // style={{
      //   borderBottom: 3,
      //   borderWidth: 3,
      //   borderColor: "red",
      //   borderStyle: "solid",
      // }}
    >
      <i className="fa fa-clock-o fa-lg pe-2 "></i>
      <span>My search element</span>
    </div>
  );
};

export default LocationFinder;
