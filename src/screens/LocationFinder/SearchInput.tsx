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
  const { submittedSearch, linkParams, results } = state.locationState;

  useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      submitSearch();
    }
  }, [submittedSearch]);

  const inputRef = useRef<null | HTMLInputElement>(null);

  const getResultsFromApi = async (search: string) => {
    await dispatch(setLoadingStatus(true));
    var features = await apiCaller(search);
    await dispatch(setResults(filterSearchResults(features)));
    await dispatch(setLoadingStatus(false));
  };

  const submitSearch = async () => {
    await dispatch(addSearchToRecents(searchValue));
    removeFocus();
    await getResultsFromApi(searchValue);
    dispatch(setSubmittedSearch(searchValue));
    if (results && results.length > 0) {
      dispatch(setSelectedLocation(results[0]));
    } else {
      // dispatch(setSelectedLocation(null));
    }
  };

  const removeFocus = () => {
    callbackForIsSearchFocussed(false);
    inputRef.current?.blur();
  };

  return (
    <div className=" col-12  rounded bg-white shadow-sm fa-border border-opacity-10 border-secondary d-flex align-items-center">
      <div className="flex-grow-1 d-flex px-3">
        <input
          ref={inputRef}
          onFocus={() => callbackForIsSearchFocussed(true)}
          onBlur={() => callbackForIsSearchFocussed(false)}
          onKeyDown={async (e) => {
            // Submit search on enter (additional feature)
            if (e.key === "Enter" && searchValue.length > 0) {
              await submitSearch();
              linkParams.set("search", searchValue);
              linkParams.delete("activeLocation");
              await dispatch(setLinkParams(linkParams));
              setSearchParams(linkParams);
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
              callbackForIsSearchFocussed(true);
              inputRef.current?.focus();
              callback("");
              dispatch(setSubmittedSearch(""));
              dispatch(setResults([]));
              dispatch(setSelectedLocation(null));
              searchParams.delete("search");
              setSearchParams({ ...searchParams });
            }}
          >
            <i className="fa fa-times-circle-o fa-lg text-secondary" />
          </button>
        )}
      </div>

      <button
        disabled={searchValue.length < 1}
        className={classNames(
          "p-2 px-3  text-white rounded-0 rounded-end fa-border border-opacity-100  shadow-none",
          searchValue && searchValue.length > 0
            ? "bg-primary border-primary"
            : "bg-secondary border-secondary"
        )}
        onClick={async () => {
          await submitSearch();
          linkParams.set("search", searchValue);
          linkParams.delete("activeLocation");
          await dispatch(setLinkParams(linkParams));
          setSearchParams(linkParams);
        }}
      >
        Search
      </button>
    </div>
  );
};
