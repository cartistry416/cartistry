import MapCard from "./MapCard";
import "../static/css/myMaps.css";
import { useContext, useState, useRef, useEffect } from "react";
import { GlobalMapContext } from "../contexts/map";
import ImportModal from "./modals/ImportModal";

function MyMapsWrapper() {
  const { mapCardsInfo } = useContext(GlobalMapContext);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateDropdown, setCreateDropdown] = useState(false);
  const [showSortDropdown, setSortDropdown] = useState(false);
  const createDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
      setCreateDropdown(false);
    }
    if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
      setSortDropdown(false);
    }
  };

  return (
    <div id="myMapsWrapper">
      <div className="functionsWrapper">
        <div ref={createDropdownRef} className="create">
          <button
            className="createMapButton"
            onClick={() => setCreateDropdown(!showCreateDropdown)}
          >
            Create Map
            {showCreateDropdown ? (
              <span className="material-icons">expand_less</span>
            ) : (
              <span className="material-icons">expand_more</span>
            )}
          </button>
          {showCreateDropdown && (
            <div className="createMapMenu">
              <button
                className="createMapMenuItem"
                onClick={() => setShowUploadModal(true)}
              >
                Bin Map
              </button>
              <button
                className="createMapMenuItem"
                onClick={() => setShowUploadModal(true)}
              >
                Heat Map
              </button>
              <button
                className="createMapMenuItem"
                onClick={() => setShowUploadModal(true)}
              >
                Subway Map
              </button>
              <button
                className="createMapMenuItem"
                onClick={() => setShowUploadModal(true)}
              >
                Cadastral Map
              </button>
              <button
                className="createMapMenuItem"
                onClick={() => setShowUploadModal(true)}
              >
                Landmark Map
              </button>
            </div>
          )}
        </div>

        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..."></input>
        </div>
        <div className="sortBy" ref={sortDropdownRef}>
          <button
            className="sortByButton"
            onClick={() => setSortDropdown(!showSortDropdown)}
          >
            Sort By
            {showSortDropdown ? (
              <span className="material-icons">expand_less</span>
            ) : (
              <span className="material-icons">expand_more</span>
            )}
          </button>
          {showSortDropdown && (
            <div className="sortByMenu">
              <button className="dropdownOption">Name(A-Z)</button>
              <button className="dropdownOption">Edit Date</button>
              <button className="dropdownOption">Create Date</button>
            </div>
          )}
        </div>
      </div>
      <div className="mapListWrapper">
        {/* {mapCardsInfo.map((map, index) => (
          <MapCard key={index} title={map.title} updatedAt={map.updatedAt} thumbnail={map.thumbnail} />
        ))} */}
        <MapCard title="Map Title" updatedAt="October 11" />
      </div>
      {showUploadModal && (
        <ImportModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

export default MyMapsWrapper;
