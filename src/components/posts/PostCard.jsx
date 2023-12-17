import { useContext, useState, useRef, useEffect } from "react";
import "../../static/css/postCard.css";
import { useNavigate } from "react-router";
import GlobalPostContext from "../../contexts/post";
import AuthContext from "../../auth";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import AlertModal from "../modals/AlertModal";

function PostCard({
  title,
  username,
  time,
  tags,
  likes,
  comments,
  thumbnail,
  postId,
  ownerId,
  showMenu,
}) {
  const { post } = useContext(GlobalPostContext);
  const { auth } = useContext(AuthContext);

  const alreadyLiked = auth.loggedIn && auth.likedPosts.has(postId);

  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleLikePost = async (e) => {
    e.stopPropagation();
    if (auth.loggedIn) {
      await post.updatePostLikes(postId);
    } else {
      setErrorMessage("Please log in to like");
      setShowError(true);
    }
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    setShowOptions(false);
    await post.loadPost(postId);
    navigate(`/editPost/${postId}?type=b`);
  };

  const onDeleteClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    setShowModal(true);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    post.deletePost(postId);
    setShowModal(false);
  };
  const generateImageSrc = (image) => {
    const blob = new Blob([new Uint8Array(image.imageData.data)], {
      type: image.contentType,
    });
    return URL.createObjectURL(blob);
  };
  let imageSrc;
  if (thumbnail && typeof thumbnail.imageData === "string") {
    imageSrc = `data:${thumbnail.contentType};base64,${thumbnail.imageData}`;
  } else if (thumbnail && thumbnail.imageData) {
    imageSrc = generateImageSrc(thumbnail);
    console.log(imageSrc);
  }

  const visitProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${username}/${ownerId}`);
  };

  const handleReset = () => {
    setShowError(false)
  }

  const timeSincePostCreated = (postTimestamp) => {
    const now = new Date();
    const postDate = new Date(postTimestamp);
  
    const timeDifference = now - postDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (years > 0) {
      return `${years}y ago`;
    } else if (months > 0) {
      return `${months}m ago`;
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  }

  return (
    <div className="postCardWrapper">
      {thumbnail && thumbnail.imageData && (
        <img className="postCardImagePreview" src={imageSrc} alt="preview" />
      )}
      <div className="postCardDescription">
        <div className="postCardTitle">{title}</div>
        <div className="postCardDescription2">
          <div onClick={visitProfile} className="username">@{username}</div>
          <div className="dividerCircle"></div>
          <div>{timeSincePostCreated(time)}</div>
          {tags.map((tag, index) => (
            <button key={index} className="tag">
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="postCardButtons">
        <button
          className={`${alreadyLiked ? "liked" : ""} postCardButton`}
          onClick={handleLikePost}
        >
          <span className="material-icons">favorite</span>
          {likes}
        </button>
        <button className="postCardButton">
          <span className="material-icons">mode_comment</span>
          {comments}
        </button>
      </div>
      {showMenu && (
        <>
          <span
            className="material-icons post-card-more-options"
            onClick={toggleMenu}
          >
            more_vert
          </span>
          <div className="postCardMore" ref={dropdownRef}>
            {showOptions && (
              <div className="postCardMenu">
                <div className="postCardMenuItem" onClick={handleEdit}>
                  <span className="material-icons">edit</span>
                  Edit
                </div>
                <div className="postCardMenuItem" onClick={onDeleteClick}>
                  <span className="material-icons">delete</span>
                  Delete
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {showError && (
        <AlertModal
          errorMessage={errorMessage}
          onCancel={() => setShowError(false)}
          onReset={handleReset}
        />
      )}
      {showModal && (
        <ConfirmDeleteModal
          onCancel={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default PostCard;
