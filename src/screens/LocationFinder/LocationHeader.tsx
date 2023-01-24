import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  setSubmittedSearch,
  setResults,
  setSelectedLocation,
  setSearch,
  setLinkParams,
} from "../../redux/actionReducers/locationReducer";

const LocationHeader = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // console.log("location", location);
  const [searchParams, setSearchParams] = useSearchParams({});

  // redux state
  const state = useSelector((state: any) => {
    return { locationState: state.locationActionReducer };
  });
  const { linkParams, submittedSearch } = state.locationState;
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [isAnimationDone, setAnimationStatus] = useState(true);
  const [showShareModal, setShareModalVisibility] = useState(false);

  const resetToDefault = () => {
    dispatch(setSubmittedSearch(""));
    dispatch(setResults([]));
    dispatch(setSelectedLocation(null));
    dispatch(setSearch(""));
    linkParams.delete("search");
    linkParams.delete("activeLocation");
    dispatch(setLinkParams(linkParams));
    setSearchParams(linkParams);
  };

  const animatePopup = () => {
    setAnimationStatus(false);
    setPopupVisibility(true);
    setTimeout(() => {
      setPopupVisibility(false);
      setTimeout(() => {
        setAnimationStatus(true);
      }, 400);
    }, 2000);
  };
  return (
    <div className="col-12 d-flex align-items-center justify-content-between pt-3  py-sm-3">
      <div
        className={classNames(
          "pop-up rounded-3 notify-popup  shadow fa-border border-opacity-10 border-secondary  p-2  ",
          isPopupVisible ? " notify-popup-show" : "notify-popup-hide",
          isAnimationDone ? "d-none" : ""
        )}
      >
        <span className="text-white">Copied to Clipboard!</span>
      </div>
      <div
        className="flex-1 d-flex py-3 align-items-center clickable "
        onClick={() => resetToDefault()}
      >
        <i
          className="fa fa-map fa-lg text-primary"
          style={{ fontSize: 30 }}
        ></i>

        <p className=" h1 fw-bold p-0 m-0 px-2 d-none d-md-block">
          Location Finder
        </p>
        <p className=" h4 fw-bold p-0 m-0 px-2  d-block d-md-none">
          Location Finder
        </p>
      </div>
      <div className="d-flex position-relative">
        {submittedSearch.length > 0 && (
          <button className="border-0 rounded-3 p-2 px-3 share-button shadow-sm">
            <i
              onClick={async () => setShareModalVisibility(!showShareModal)}
              className="fa fa-share-alt clickable "
              aria-hidden="true"
            >
              <span className="ms-2">Share</span>
            </i>
          </button>
        )}
        {showShareModal && (
          <div className="pop-up rounded-3 bg-white shadow fa-border border-opacity-10 border-secondary">
            <div className="d-flex justify-content-between align-items-center">
              <p className=" flex-grow-1 fw-bold m-0 text-secondary">
                Share with friends
              </p>
              <i
                className="fa fa-times-circle-o fa-lg clickable "
                onClick={() => setShareModalVisibility(false)}
              />
            </div>
            <div
              className="d-flex align-items-center border-1 rounded p-1 mt-2 "
              style={{ backgroundColor: "rgba(12,109,253, 0.1)" }}
            >
              <input
                className="border-0 bg-transparent px-2"
                style={{ width: 200, fontSize: 12 }}
                disabled={true}
                value={window.location.href}
              ></input>
              <i
                onClick={() => {
                  // copy to clipboard here
                  navigator.clipboard.writeText(window.location.href);
                  animatePopup();
                }}
                className="fa fa-copy fa-lg p-2  rounded clickable text-primary"
                style={{ backgroundColor: "rgba(12,109,253, 0.3)" }}
              />
              {/* http://localhost:3000/?search=new+bedford&activeLocation=298029530 */}
              {/* http://localhost:3000/?search=new+bedford&activeLocation=298029530 */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationHeader;
