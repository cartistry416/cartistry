import "../static/css/mapCard.css";

function MapCard() {
  return (
    <div className="mapCardWrapper">
      <img className="mapCardImagePreview"></img>
      <div className="mapCardDescription">
        <div className="mapCardInfo">
          <div className="mapCardTitle">Map Title</div>
          <div className="mapCardDate">Opened Oct 6, 2023</div>
        </div>
        <div className="mapCardMore">
          <div className="mapCardMenu">
            <div className="mapCardMenuItem">
              <span className="material-icons">ios_share</span>
              Export
            </div>
            <div className="mapCardMenuItem">
              <span className="material-icons">publish</span>
              Publish
            </div>
            <div className="mapCardMenuItem">
              <span className="material-icons">fork_right</span>
              Fork
            </div>
            <div className="mapCardMenuItem">
              <span className="material-icons">edit</span>
              Rename
            </div>
            <div className="mapCardMenuItem">
              <span className="material-icons">delete</span>
              Delete
            </div>
          </div>
          <span className="material-icons">more_vert</span>
        </div>
      </div>
    </div>
  );
}

export default MapCard;
