import "../static/css/myPosts.css";
import PostCard from "./PostCard";

function MyPostsScreen() {
  return (
    <div id="myPostsContainer">
      <div className="functionsWrapper">
        <span id="myPostsHeader">My Posts</span>
        <div className="searchBarWrapper">
          <span className="searchIcon material-icons">search</span>
          <input id="searchInput" type="text" placeholder="Search..."></input>
        </div>
        <div>
          <button>
            Sort By <span className="material-icons">expand_more</span>
          </button>
          <div className="sortByMenu show">
            <button className="sortByMenuItem">Newest</button>
            <button className="sortByMenuItem">Oldest</button>
            <button className="sortByMenuItem">Liked</button>
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