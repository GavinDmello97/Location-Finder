import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { apiCaller } from "../../configs/apiCallers";
import { filterSearchResults } from "../../configs/utils";
import {
  setLoadingStatus,
  setResults,
  addSearchToRecents,
  setSubmittedSearch,
  setSelectedLocation,
  setLinkParams,
} from "../../redux/actionReducers/locationReducer";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  searchValue = "",
  callback = () => {},
  callbackForIsSearchFocussed = () => {},
}: {
  searchValue: string;
  callback: Function;
  callbackForIsSearchFocussed: Function;
}) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({});

  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const { submittedSearch, linkParams } = state.locationState;

  const inputRef = useRef<null | HTMLInputElement>(null);

  const getResultsFromApi = async (search: string) => {
    await dispatch(setLoadingStatus(true));
    var features = await apiCaller(search);
    const filteredData = filterSearchResults(features);
    await dispatch(setLoadingStatus(false));
    return filteredData;
  };

  const submitSearch = async () => {
    await dispatch(addSearchToRecents(searchValue));
    removeFocus();
    var results = await getResultsFromApi(searchValue);
    dispatch(setResults(results));
    dispatch(setSubmittedSearch(searchValue));
    if (results && results.length > 0) {
      var result = results[0];
      linkParams.set("search", searchValue);
      linkParams.set("activeLocation", result.place_id);
      await dispatch(setLinkParams(linkParams));
      setSearchParams(linkParams);
      dispatch(setSelectedLocation(result));
    }
  };

  const removeFocus = () => {
    callbackForIsSearchFocussed(false);
    inputRef.current?.blur();
  };

  return (
    <div className=" col-12  rounded-3 bg-white shadow-sm fa-border border-opacity-10 border-secondary d-flex align-items-center">
      <div className="flex-grow-1 d-flex px-2">
        <input
          ref={inputRef}
          onFocus={() => callbackForIsSearchFocussed(true)}
          onBlur={() => callbackForIsSearchFocussed(false)}
          onKeyDown={async (e) => {
            // Submit search on enter (additional feature)
            if (e.key === "Enter" && searchValue.length > 0) {
              await submitSearch();
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
            className="bg-white border-0 noselect"
            onClick={() => {
              callbackForIsSearchFocussed(true);
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
          "p-2 px-3  text-white rounded-0 rounded-end fa-border border-opacity-100  shadow-none noselect",
          searchValue && searchValue.length > 0
            ? "bg-primary border-primary"
            : "bg-secondary border-secondary"
        )}
        onClick={async () => {
          await submitSearch();
        }}
      >
        Search
      </button>
    </div>
  );
};
