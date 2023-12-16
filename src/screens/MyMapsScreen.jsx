import MapCard from "../components/map/MapCard";
import "../static/css/myMaps.css";
import { useContext, useState, useRef, useEffect } from "react";
import { GlobalMapContext } from "../contexts/map";
import ImportModal from "../components/modals/ImportModal";
import AuthContext from "../auth";
import GlobalPostContext from "../contexts/post";
import ForbiddenMessage from "../components/modals/ForbiddenMessage";


function MyMapsScreen() {
  const { auth } = useContext(AuthContext);
  const { map } = useContext(GlobalMapContext);
  const { post } = useContext(GlobalPostContext)
  const [showUploadModal, setShowUploadModal] = useState("");
  const [showCreateDropdown, setCreateDropdown] = useState(false);
  const [showSortDropdown, setSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState("first"); 
  const [loaded, setLoaded] = useState(false)
  const createDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    if (auth.loggedIn && !loaded && sortOption === "first") {
      map.loadMapCards(auth.user.userId).then(() => {
        setLoaded(true)
      })
    }
    else if (auth.loggedIn && loaded && sortOption !== "") {
      sortMaps(sortOption);
      setSortOption("")
    }
    else if (map.currentMapMetadata) {
      setLoaded(false)
    }
    setSortDropdown(false)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [auth, loaded, map.currentMapMetadata, sortOption]);

  const sortMaps = () => {
    map.sortBy(sortOption)
  };

  useEffect(() => {
    // console.log(map.mapCardsInfo)
    post.exitCurrentPost()
    map.exitCurrentMap()
  }, [])

  const handleOutsideClick = (event) => {
    if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
      setCreateDropdown(false);
    }
    if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
      setSortDropdown(false);
    }
  };

  const handleSearchChange = (e) => {
    setRefresh(prev => prev + 1)
  }

  return (
    <div id="myMapsWrapper">
      { auth.loggedIn ? (
        <>
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
                  onClick={() => setShowUploadModal("bin")}
                >
                  Bin Map
                </button>
                <button
                  className="createMapMenuItem"
                  onClick={() => setShowUploadModal("heat")}
                >
                  Heat Map
                </button>
                <button
                  className="createMapMenuItem"
                  onClick={() => setShowUploadModal("subway")}
                >
                  Subway Map
                </button>
                <button
                  className="createMapMenuItem"
                  onClick={() => setShowUploadModal("cadastral")}
                >
                  Cadastral Map
                </button>
                <button
                  className="createMapMenuItem"
                  onClick={() => setShowUploadModal("landmark")}
                >
                  Landmark Map
                </button>
              </div>
            )}
          </div>

          <div className="searchBarWrapper">
            <span className="searchIcon material-icons">search</span>
            <input ref={searchInputRef} id="searchInput" type="text" placeholder="Search..." onChange={handleSearchChange}></input>
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
                <button className="dropdownOption" onClick={() => setSortOption("name")}>Name(A-Z)</button>
                <button className="dropdownOption" onClick={() => setSortOption("edit")}>Edit Date</button>
                <button className="dropdownOption" onClick={() => setSortOption("create")}>Create Date</button>
              </div>
            )}
          </div>
        </div>
        <div className="mapListWrapper">
          {map.mapCardsInfo.map((map, index) => {
            if(searchInputRef.current && searchInputRef.current.value !== "" && !(map.title).includes(searchInputRef.current.value)){
              return null
            }
            return ( 
            <MapCard key={index} index={index} mapId={map._id} title={map.title} updatedAt={map.updatedAt} thumbnail={map.thumbnail} />
          )})}
        </div>
        { (showUploadModal !== "") && (
          <ImportModal onClose={() => setShowUploadModal("")} templateType={showUploadModal} />
        )}
        </>
      ) : (
        <ForbiddenMessage />
      )}
    </div>
  );
}

export default MyMapsScreen;
