import MapCard from "./MapCard";
import "../static/css/profile.css";
import { useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { GlobalMapContext } from "../contexts/map";

function ProfileScreen() {
  const { username, id } = useParams();
  const { map } = useContext(GlobalMapContext);

  useEffect(() => {
    map.loadMapCards(id)
    console.log(username, id);
    console.log(map.mapCardsInfo)
  }, []);

  return (
    <div className="profileContainer">
      <div className="profileHeader">
        <span className="material-icons">account_circle</span>
        <h3>{username}</h3>
      </div>
      {/* <div className="mapListWrapper">
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
        <MapCard />
      </div> */}
      <div className="mapListWrapper">
        {(map.mapCardsInfo.length === 0) && (
          <div>No public maps to display</div>
        )}
        {map.mapCardsInfo.map((map, index) => {
          return (
            <MapCard
              key={index}
              index={index}
              mapId={map._id}
              title={map.title}
              updatedAt={map.updatedAt}
              thumbnail={map.thumbnail}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProfileScreen;
