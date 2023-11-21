import "../static/css/myPosts.css";
import PostCard from "./Posts/PostCard";
import { useEffect, useRef, useState, useContext } from "react";
import { formatTime } from "./HomeWrapper/HomeWrapper";
import { GlobalPostContext } from "../contexts/post";
import { AuthContext } from "../auth";
import { useNavigate } from "react-router";

function MyPostsScreen() {
  const { post } = useContext(GlobalPostContext);
  const { auth } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const handlePostCardClick = (id) => {
    navigate(`/post/${id}`);
  };

  const myPosts = post.postCardsInfo.filter(postCard => {
    // console.log("PostCard ID:", postCard._id, "Owner User ID:", postCard.owner, "Auth User ID:", auth.user.userId);
    return postCard.owner === auth.user.userId;
  });

  // const myPosts = post.postCardsInfo.filter(postCard => postCard.ownerUserId === auth.user);

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
          {myPosts.map((postCard, index) => (
            <div onClick={() => handlePostCardClick(postCard._id)} key={index}>
              <PostCard
                title={postCard.title}
                username={postCard.ownerUserName}
                time={formatTime(postCard.createdAt)} 
                tags={postCard.tags}
                likes={postCard.likes}
                comments={postCard.comments.length}
                imageUrl={postCard.images[0]}
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
  )
}

export default MyPostsScreen