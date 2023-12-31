import "../static/css/myPosts.css";
import PostCard from "../components/posts/PostCard";
import { useEffect, useRef, useState, useContext } from "react";
import { formatTime } from "./HomeScreen";
import { GlobalPostContext } from "../contexts/post";
import { AuthContext } from "../auth";
import { useNavigate } from "react-router";
import GlobalMapContext from "../contexts/map";
import { getAllTags } from "../utils/utils";

function MyPostsScreen() {
  const { map } = useContext(GlobalMapContext)
  const { post } = useContext(GlobalPostContext);
  const { auth } = useContext(AuthContext);
  const [sortOption, setSortOption] = useState("first"); 
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
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
  
  //TODO, filter users to current logged in for this
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

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handlePostCardClick =  async (id, mapMetadata) => {
    if(mapMetadata){
      map.exitCurrentMap()
      await map.loadMap(mapMetadata);
    }
    navigate(`/post/${id}`);
  };

  const myPosts = post.postCardsInfo.filter(postCard => {
    // console.log("PostCard ID:", postCard._id, "Owner User ID:", postCard.owner, "Auth User ID:", auth.user.userId);
    return postCard.owner === auth.user.userId;
  });

  const handleSearchChange = (e) => {
    if (e.key === "Enter") {
      post.searchPostsByTitle(e.target.value)
    }
  }

  const addTag = (tagToAdd) => {
    post.addFilterTag(tagToAdd)
  };

  const removeTag = (tagToRemove) => {
    post.removeFilterTag(tagToRemove)
  };

  // const myPosts = post.postCardsInfo.filter(postCard => postCard.ownerUserId === auth.user);

  return (
    <div id="myPostsContainer">
      <div className="functionsWrapper">
        <span id="myPostsHeader">My Posts</span>
        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..." onKeyDown={handleSearchChange}></input>
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
          {myPosts.map((postCard, index) => {
            if(postCard && postCard.owner !== auth.user.userId){
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
                  showMenu={true}
                />
              </div>
            )
          })}
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
    </div>
  )
}

export default MyPostsScreen