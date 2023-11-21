import "../../static/css/home.css";
import PostCard from "../Posts/PostCard";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import { GlobalPostContext } from "../../contexts/post";

export function formatTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (diffInSeconds < minute) {
      return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
  } else if (diffInSeconds < hour) {
      const mins = Math.floor(diffInSeconds / minute);
      return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  } else if (diffInSeconds < day) {
      const hrs = Math.floor(diffInSeconds / hour);
      return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day);
      return `${days} day${days === 1 ? '' : 's'} ago`;
  } else {
      // For longer durations, return the date
      return date.toLocaleDateString();
  }
}

function HomeWrapper() {
  const { post } = useContext(GlobalPostContext);
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

  useEffect(() => {
    post.loadPostCards("mostRecent", 10);
  }, []); 
  useEffect(() => {
    console.log("Updated Post Cards Info:", post.postCardsInfo);
}, [post.postCardsInfo]);

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
          {post.postCardsInfo.map((postCard, index) => (
            <PostCard
                key={index}
                title={postCard.title}
                username={postCard.username}
                time={formatTime(postCard.createdAt)} 
                tags={postCard.tags}
                likes={postCard.likes} //TODO Increase like count from postcard button
                comments={postCard.comments.length}
                imageUrl={postCard.images[0]} //TODO handle image
            />
          ))}
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
