import { useState } from "react";
import "../../static/css/postCard.css";
import { useNavigate } from "react-router";

function PostCard() {
    const [liked, setLiked] = useState("");
  const navigate = useNavigate();
  const redirectTo = (path) => {
    navigate(path);
  };

  const handleLikePost = (e) => {
    e.stopPropagation();
    if (liked === "") {
      setLiked("liked");
    } else {
      setLiked("");
    }
    console.log(e.target)
  }

  return (
    <div className="postCardWrapper" onClick={() => redirectTo("/post")}>
      <img className="postCardImagePreview" alt="preview"></img>
      <div className="postCardDescription">
        <div className="postCardTitle">Post Title Post Title Post Title</div>
        <div className="postCardDescription2">
          <div>username</div>
          <div className="dividerCircle"></div>
          <div>4d</div>
          <button className="tag">Tag One</button>
        </div>
      </div>
      <div className="postCardButtons">
        <button className={liked + " postCardButton"}  onClick={handleLikePost}>
          <span className="material-icons">favorite</span>32
        </button>
        <button className="postCardButton">
          <span className="material-icons">mode_comment</span>32
        </button>
      </div>
    </div>
  );
}

export default PostCard;
