import "../static/css/home.css";
import PostCard from "../components/posts/PostCard";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import { GlobalPostContext } from "../contexts/post";
import GlobalMapContext from "../contexts/map";
import AuthContext from "../auth";
import AlertModal from "../components/modals/AlertModal";
import { getAllTags } from "../utils/utils";

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

function HomeScreen() {
  const { post } = useContext(GlobalPostContext);
  const { map } = useContext(GlobalMapContext)
  const { auth } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapSelected, setMapSelected] = useState("");
  const [sortOption, setSortOption] = useState("first"); 
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const allTags = getAllTags()
  const [selectedTags, setSelectedTags] = useState([])
  const [unselectedTags, setUnselectedTags] = useState(allTags)


  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    post.exitCurrentPost()
    map.exitCurrentMap()

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const newSelectedTags = post.selectedTags
    const newUnselectedTags = allTags.filter(tag => !post.selectedTags.includes(tag))
    setSelectedTags(newSelectedTags)
    setUnselectedTags(newUnselectedTags)
  }, [post.selectedTags])

  //TODO, handle limit differently, maybe have pages
  useEffect(() => {
    // Call the sorting function whenever the sort option changes
    if (sortOption === "first") {
      post.loadPostCards("mostRecent")
      setSortOption("")
    }
    else if (sortOption !== "") {
      sortPosts(sortOption);
      setSortOption("")
    }
    setShowDropdown(false)
  }, [sortOption]);

  const sortPosts = () => {
    post.sortBy(sortOption)
  };

//   useEffect(() => {
//     console.log("Updated Post Cards Info:", post.postCardsInfo);
// }, [post.postCardsInfo]);

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

  const handlePostCardClick = async (id, mapMetadata) => {
    if(mapMetadata){
      map.exitCurrentMap()
      await map.loadMap(mapMetadata);
    }
    navigate(`/post/${id}`);
  };

  const handleSearchChange = (e) => {
    if (e.key === "Enter") {
      post.searchPostsByTitle(e.target.value)
    }
  }

  const handleCreatePost = () => {
    if(auth.loggedIn){
      if (post.currentPost) {
        post.exitCurrentPost()
        map.exitCurrentMap()
      }
      redirectTo("/editpost");
    }
    else{
      setErrorMessage("Please log in to post")
      setShowError(true)
    }
  }

  const addTag = (tagToAdd) => {
    post.addFilterTag(tagToAdd)
  };

  const removeTag = (tagToRemove) => {
    post.removeFilterTag(tagToRemove)
  };
  
  const handleReset = () => {
    setShowError(false)
  }
  return (
    <div id="homeWrapper">
      <div className="functionsWrapper">
        <button id="createPostButton" onClick={handleCreatePost}>
          Create Post
        </button>
        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..." onKeyDown={handleSearchChange}></input>
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
          {post.postCardsInfo.map((postCard, index) =>  {
            if (mapSelected === "mapOnlySelected" && (postCard.mapMetadata === "" || !postCard.mapMetadata)) {
              return null
            }
            if (post.selectedTags.length > 0 && !postCard.tags.some(tag => post.selectedTags.includes(tag))) {
              return null;
            }
            return (
            <div onClick={() => handlePostCardClick(postCard._id, postCard.mapMetadata)} key={index}>
              <PostCard
                title={postCard.title}
                username={postCard.ownerUserName}
                time={formatTime(postCard.createdAt)} 
                tags={postCard.tags}
                likes={postCard.likes}
                comments={postCard.numComments}
                thumbnail={postCard.thumbnail}
                postId={postCard._id}
                ownerId={postCard.owner}
                showMenu={false}
              />
            </div>
          ) }
          
          )}
        </div>
        <div className="tagWrapperHome">
          <div className="tagTitle">Tags</div>
          <div className="tagList">
            <div className="tags">
              {selectedTags.map((tag, index) => (
                <span
                  key={index}
                  className="tag selected"
                  onClick={() => removeTag(tag)}
                >
                  {tag}<span className="material-icons">remove</span>
                </span>
              ))}
              {unselectedTags.map((tag, index) => (
                <span
                  key={index}
                  className="tag"
                  onClick={() => addTag(tag)}
                >
                  {tag} <span className="material-icons">add</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showError && (
          <AlertModal errorMessage={errorMessage} onCancel={() => setShowError(false)} onReset={handleReset} />
        )}
    </div>
  );
}

export default HomeScreen;
