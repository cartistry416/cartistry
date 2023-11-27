import "../../static/css/home.css";
import PostCard from "../Posts/PostCard";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import { GlobalPostContext } from "../../contexts/post";
import GlobalMapContext from "../../contexts/map";
import AuthContext from "../../auth";

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
  const { map } = useContext(GlobalMapContext)
  const { auth } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapSelected, setMapSelected] = useState("");
  const [sortOption, setSortOption] = useState("mostRecent"); 
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    post.exitCurrentPost()
    map.exitCurrentMap()
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  //TODO, handle limit differently, maybe have pages
  useEffect(() => {
    // Call the sorting function whenever the sort option changes
    sortPosts();
  }, [sortOption]);

  const sortPosts = () => {
    switch (sortOption) {
      case "mostRecent":
        post.loadPostCards("mostRecent", 10);
        break;
      case "leastRecent":
        post.loadPostCards("leastRecent", 10);
        break;
      case "liked":
        // Implement the logic to sort by likes
        break;
      default:
        post.loadPostCards("mostRecent", 10);
    }
  };

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

  const handlePostCardClick = (id) => {
    navigate(`/post/${id}`);
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
                <div className="dropdownOption" onClick={() => setSortOption("mostRecent")}>Newest</div>
                <div className="dropdownOption" onClick={() => setSortOption("leastRecent")}>Oldest</div>
                <div className="dropdownOption" onClick={() => setSortOption("liked")}>Liked</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="contentWrapper">
        <div id="postListWrapper">
          {post.postCardsInfo.map((postCard, index) => (
            <div onClick={() => handlePostCardClick(postCard._id)} key={index}>
              <PostCard
                title={postCard.title}
                username={postCard.ownerUserName}
                time={formatTime(postCard.createdAt)} 
                tags={postCard.tags}
                likes={postCard.likes}
                alreadyLiked={auth.loggedIn && auth.likedPosts.has(postCard._id)}
                comments={postCard.numComments}
                thumbnail={postCard.thumbnail}
                postId={postCard._id}
              />
            </div>
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
