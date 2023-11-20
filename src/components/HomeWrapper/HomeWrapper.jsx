import "../../static/css/home.css";
import PostCard from "../Posts/PostCard";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

function HomeWrapper() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapSelected, setMapSelected] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const toggleMapsOnly = () => {
    if (mapSelected === "") {
      setMapSelected("mapOnlySelected");
    } else {
      setMapSelected("");
    }
  };

  const redirectTo = (path) => {
    navigate(path);
  };

  return (
    <div id="homeWrapper">
      <div className="functionsWrapper">
        <button id="createPostButton" onClick={() => redirectTo("/editpost")}>
          Create Post
        </button>
        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..."></input>
        </div>
        <button className={mapSelected} onClick={toggleMapsOnly}>
          Maps Only
        </button>
        <div ref={dropdownRef}>
          <div className="sortBy">
            <button
              className="sortByButton"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Sort By{" "}
              {showDropdown ? (
                <span className="material-icons">expand_less</span>
              ) : (
                <span className="material-icons">expand_more</span>
              )}
            </button>
            {showDropdown && (
              <div className="sortByMenu">
                <div className="dropdownOption">Newest</div>
                <div className="dropdownOption">Oldest</div>
                <div className="dropdownOption">Liked</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="contentWrapper">
        <div id="postListWrapper">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
        <div className="tagWrapper">
          <div className="tagTitle">Tags</div>
          <button className="tag">Tag Twenty</button>
          <button className="tag">Tag One</button>
          <button className="tag">Tag Forty</button>
        </div>
      </div>
    </div>
  );
}

export default HomeWrapper;
