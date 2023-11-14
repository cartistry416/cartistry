import MapCard from "./MapCard";
import "../static/css/myMaps.css";

function MyMapsWrapper() {
  return (
    <div id="myMapsWrapper">
      <div className="functionsWrapper">
        <div>
          <button className="createMapButton open">
            Create Map<span className="material-icons">expand_more</span>
          </button>
          <div className="createPostMenu show">
            <button className="createPostMenuItem">Bin Map</button>
            <button className="createPostMenuItem">Heat Map</button>
            <button className="createPostMenuItem">Subway Map</button>
            <button className="createPostMenuItem">Cadastral Map</button>
            <button className="createPostMenuItem">Landmark Map</button>
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
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
      </div>
    </div>
  );
}

export default MyMapsWrapper;
