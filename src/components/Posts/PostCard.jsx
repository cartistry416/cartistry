import { useContext, useState, useRef } from "react";
import "../../static/css/postCard.css";
import { useNavigate } from "react-router";
import GlobalPostContext from "../../contexts/post";
import AuthContext from "../../auth";

function PostCard({ title, username, time, tags, likes, comments, thumbnail, postId, showMenu}) {
  const {post} = useContext(GlobalPostContext)
  const {auth} = useContext(AuthContext)

  const alreadyLiked = auth.loggedIn && auth.likedPosts.has(postId)
  
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const redirectTo = (path) => {
    navigate(path);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };
  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleLikePost = async (e) => {
    e.stopPropagation();
    await post.updatePostLikes(postId)
  }

  const generateImageSrc = (image) => {

    const blob = new Blob([new Uint8Array(image.imageData.data)], { type: image.contentType })
    return URL.createObjectURL(blob)
  }
  let imageSrc;
  if (thumbnail && typeof thumbnail.imageData === 'string') {
    imageSrc = `data:${thumbnail.contentType};base64,${thumbnail.imageData}`
  }
  else if (thumbnail && thumbnail.imageData) {
    imageSrc = generateImageSrc(thumbnail)
    console.log(imageSrc)
  }
  // comment for commit
  return (
        <div className="postCardWrapper">
            {thumbnail && thumbnail.imageData && <img className="postCardImagePreview" src={imageSrc} alt="preview" />}
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
            {showMenu && (
              <>
                <span className="material-icons" onClick={toggleMenu}>
                  more_vert
                </span>
                {showOptions && (
                  <div className="CardMenu" ref={dropdownRef}>           
                    <div className="mapCardMenuItem" >
                      <span className="material-icons">edit</span>
                      Edit
                    </div>
                    <div className="mapCardMenuItem" >
                      <span className="material-icons">delete</span>
                      Delete
                    </div>
                  </div>
                )}
              </>
            )}

        </div>
    );
}

export default PostCard;
