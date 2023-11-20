import "../static/css/myPosts.css";
import PostCard from "./Posts/PostCard";
import { useEffect, useRef, useState } from "react";

function MyPostsScreen() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div id="myPostsContainer">
      <div className="functionsWrapper">
        <span id="myPostsHeader">My Posts</span>
        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..."></input>
        </div>
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
  )
}

export default MyPostsScreen