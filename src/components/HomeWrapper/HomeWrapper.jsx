import "../../static/css/home.css";
import PostCard from "../PostCard";
function HomeWrapper() {
  return (
    <div id="homeWrapper">
      <div className="functionsWrapper">
        <button id="createPostButton">Create Post</button>
        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..."></input>
        </div>
        <button>Maps Only</button>
        <button>
          Sort By <span className="material-icons">expand_more</span>
        </button>
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
