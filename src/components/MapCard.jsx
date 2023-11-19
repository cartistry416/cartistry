import { useState } from "react";
import "../static/css/mapCard.css";
import { getImage } from "../utils/utils";

function MapCard(props) {
  const [showOptions, setShowOptions] = useState(false)
  const { title, updatedAt, thumbnail } = props
  const imageUrl = thumbnail ? getImage(thumbnail.imageData) : '/'

  return (
    <div className="mapCardWrapper">
      <img src={imageUrl} alt='map' className="mapCardImagePreview"></img>
      <div className="mapCardDescription">
        <div className="mapCardInfo">
          <div className="mapCardTitle">{title}</div>
          <div className="mapCardDate">{'Opened '} {updatedAt}</div>
        </div>
        <div className="mapCardMore">
          {showOptions && (
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
          )}
          <span className="material-icons" onClick={() => setShowOptions(!showOptions)}>more_vert</span>
        </div>
      </div>
    </div>
  );
}

export default MapCard;
