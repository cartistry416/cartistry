import MapCard from "./MapCard";
import "../static/css/myMaps.css";
import { useContext, useState } from "react";
import { GlobalMapContext } from "../contexts/map";
import ImportModal from "./modals/ImportModal";

function MyMapsWrapper() {
  const { mapCardsInfo } = useContext(GlobalMapContext)
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <div id="myMapsWrapper">
      <div className="functionsWrapper">
        <div>
          <button className="createMapButton open">
            Create Map<span className="material-icons">expand_more</span>
          </button>
          <div className="createPostMenu show">
            <button className="createPostMenuItem" onClick={() => setShowUploadModal(true)}>Bin Map</button>
            <button className="createPostMenuItem" onClick={() => setShowUploadModal(true)}>Heat Map</button>
            <button className="createPostMenuItem" onClick={() => setShowUploadModal(true)}>Subway Map</button>
            <button className="createPostMenuItem" onClick={() => setShowUploadModal(true)}>Cadastral Map</button>
            <button className="createPostMenuItem" onClick={() => setShowUploadModal(true)}>Landmark Map</button>
          </div>
        </div>

        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..."></input>
        </div>
        <div>
          <button className="sortByButton open">
            Sort By <span className="material-icons">expand_more</span>
          </button>
          <div className="sortByMenu show">
            <button className="sortByMenuItem">Name(A-Z)</button>
            <button className="sortByMenuItem">Edit Date</button>
            <button className="sortByMenuItem">Publish Date</button>
            <button className="sortByMenuItem">Create Date</button>
          </div>
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
