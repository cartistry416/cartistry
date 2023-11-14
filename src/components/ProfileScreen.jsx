import MapCard from './MapCard'
import "../static/css/profile.css";

function ProfileScreen() {
  return (
    <div className="profileContainer">
      <div className="profileHeader">
        <span class="material-icons">account_circle</span>
        <h3>username</h3>
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
  )
}

export default ProfileScreen