import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth";
import "../static/css/navBar.css";

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    console.log(dropdownRef);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const redirectTo = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const logoutUser = () => {
    auth.logoutUser();
    navigate("/");
  };

  return (
    <div id="navBarWrapper">
      <h1 id="logotype" onClick={() => redirectTo("/home")}>
        Cartistry
      </h1>
      <div ref={dropdownRef}>
        <div
          className="profileIcon material-icons"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          account_circle
        </div>
        {showDropdown && (
          <div className="nav-dropdown">
            <div className="nav-dropdown-list">
              {auth.loggedIn ? (
                <div>
                  <div
                    className="nav-dropdown-option"
                    onClick={() => redirectTo("/mymaps")}
                  >
                    <span>My Maps</span>
                  </div>
                  <div
                    className="nav-dropdown-option"
                    onClick={() => redirectTo("/myposts")}
                  >
                    <span>My Posts</span>
                  </div>
                  <div
                    className="nav-dropdown-option"
                    onClick={() => redirectTo("/resetpassword")}
                  >
                    <span>Reset Password</span>
                  </div>
                  <div className="nav-dropdown-option" onClick={logoutUser}>
                    <span>Logout</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="nav-dropdown-option"
                    onClick={() => redirectTo("/")}
                  >
                    <span>Login</span>
                  </div>
                  <div
                    className="nav-dropdown-option"
                    onClick={() => redirectTo("/register")}
                  >
                    <span>Register</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
