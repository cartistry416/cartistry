import { useState } from "react";
import "../static/css/navBar.css";

function redirect(){
  window.location.href = '/';
}

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <div id="navBarWrapper">
      <h1 id="logotype" onClick={redirect}>Cartistry</h1>
      <div className="profileIcon material-icons" onClick={() => setShowDropdown(!showDropdown)}>account_circle</div>
      {showDropdown && (
        <div className="nav-dropdown">
          <div className="nav-dropdown-list">
            <div className="nav-dropdown-option">
              <span>My Maps</span>
            </div>
            <div className="nav-dropdown-option">
              <span>My Posts</span>
            </div>
            <div className="nav-dropdown-option">
              <span>Reset Password</span>
            </div>
            <div className="nav-dropdown-option">
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
