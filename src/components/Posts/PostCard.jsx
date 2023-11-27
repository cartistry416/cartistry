import { useContext, useState } from "react";
import "../../static/css/postCard.css";
import { useNavigate } from "react-router";
import GlobalPostContext from "../../contexts/post";
import AuthContext from "../../auth";

function PostCard({ title, username, time, tags, alreadyLiked, likes, comments, thumbnail, postId }) {
  const {post} = useContext(GlobalPostContext)
  const navigate = useNavigate();
  const redirectTo = (path) => {
    navigate(path);
  };

  const handleLikePost = async (e) => {
    e.stopPropagation();
    await post.updatePostLikes(postId)
  }

  const generateImageSrc = (image) => {
    const blob = new Blob([new Uint8Array(image.imageData.data)], { type: image.contentType })
    return URL.createObjectURL(blob)
  }
  let imageData;
  if (thumbnail && typeof thumbnail.imageData === 'string') {
    imageData = thumbnail.imageData
  }
  else if (thumbnail && thumbnail.imageData) {
    imageData = generateImageSrc(thumbnail)
  }
  // comment for commit
  return (
        <div className="postCardWrapper">
            {thumbnail && <img className="postCardImagePreview" src={`data:${thumbnail.contentType};base64,${thumbnail.imageData}`} alt="preview" />}
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
                <button className={`${alreadyLiked ? "liked" : ""} postCardButton`} onClick={handleLikePost}>
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
