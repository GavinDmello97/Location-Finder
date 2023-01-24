import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { apiCaller } from "../../configs/apiCallers";
import { filterSearchResults } from "../../configs/utils";
import {
  setSubmittedSearch,
  setSearch,
  setLinkParams,
  setSelectedLocation,
  addSearchToRecents,
  setResults,
  setLoadingStatus,
} from "../../redux/actionReducers/locationReducer";
import SearchInput from "./SearchInput";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const dispatch = useDispatch();
  const [isSearchFocussed, setSearchFocussed] = useState(false);
  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const { search, recentSearches } = state.locationState;

  return (
    <div className="col-12 position-relative search-box">
      <SearchInput
        searchValue={search}
        callback={(value: string) => dispatch(setSearch(value))}
        callbackForIsSearchFocussed={(status: boolean) =>
          setTimeout(() => setSearchFocussed(status), status === true ? 0 : 200)
        }
      />

      {isSearchFocussed && recentSearches.length > 0 && (
        <div
          className="position-absolute w-100 bg-white rounded-0 rounded-bottom shadow fa-border border-top-0 border-opacity-10 border-secondary py-2"
          style={{ zIndex: 2000 }}
        >
          {recentSearches.map((searchElement: string, index: number) => (
            <RecentSearchListCard key={index} value={searchElement} />
          ))}
        </div>
      )}
    </div>
  );
};

const RecentSearchListCard = ({ value = "s" }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const { linkParams, results } = state.locationState;
  const [searchParams, setSearchParams] = useSearchParams({});

  const getResultsFromApi = async (search: string) => {
    await dispatch(setLoadingStatus(true));
    var features = await apiCaller(search);
    const filteredData = filterSearchResults(features);
    await dispatch(setLoadingStatus(false));
    return filteredData;
  };
  return (
    <div
      className="col-12 col text-start p-2 search-recent-item px-3 "
      onClick={async () => {
        await dispatch(setSearch(value));
        await dispatch(setSubmittedSearch(value));
        linkParams.set("search", value);
        await dispatch(setLinkParams(linkParams));
        setSearchParams(linkParams);
        var results = await getResultsFromApi(value);
        dispatch(setResults(results));
        dispatch(setSubmittedSearch(value));
        if (results && results.length > 0) {
          var result = results[0];
          linkParams.set("activeLocation", result.place_id);
          await dispatch(setLinkParams(linkParams));
          setSearchParams(linkParams);
          dispatch(setSelectedLocation(result));
        }
      }}
    >
      <i className="fa fa-clock-o fa-lg pe-2 "></i>
      <span>{value}</span>
    </div>
  );
};
