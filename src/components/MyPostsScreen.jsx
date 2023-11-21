import "../static/css/myPosts.css";
import PostCard from "./Posts/PostCard";
import { useEffect, useRef, useState, useContext } from "react";
import { formatTime } from "./HomeWrapper/HomeWrapper";
import { GlobalPostContext } from "../contexts/post";

function MyPostsScreen() {
  const { post } = useContext(GlobalPostContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  
  //TODO, filter users to current logged in for this
  useEffect(() => {
    post.loadPostCards("mostRecent", 10);
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
  )
}

export default MyPostsScreen