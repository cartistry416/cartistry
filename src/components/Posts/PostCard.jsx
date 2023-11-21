import { useState } from "react";
import "../../static/css/postCard.css";
import { useNavigate } from "react-router";

function PostCard({ title, username, time, tags, likes, comments, imageUrl }) {
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

  // comment for commit
  return (
        <div className="postCardWrapper">
            {imageUrl && <img className="postCardImagePreview" src={imageUrl} alt="preview" />}
            <div className="postCardDescription">
                <div className="postCardTitle">{title}</div>
                <div className="postCardDescription2">
                    <div>{username}</div>
                    <div className="dividerCircle"></div>
                    <div>{time}</div>
                    {tags.map((tag, index) => (
                        <button key={index} className="tag">{tag}</button>
                    ))}
                </div>
            </div>
            <div className="postCardButtons">
                <button className={`${liked} postCardButton`} onClick={handleLikePost}>
                    <span className="material-icons">favorite</span>{likes}
                </button>
                <button className="postCardButton">
                    <span className="material-icons">mode_comment</span>{comments}
                </button>
            </div>
        </div>
    );
}

export default PostCard;
