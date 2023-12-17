import { useContext, useState } from "react";
import "../../static/css/comment.css";
import AuthContext from "../../auth";
import GlobalPostContext from "../../contexts/post";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

function Comment({comment, index}) {
  const {auth} = useContext(AuthContext)
  const {post} = useContext(GlobalPostContext)
  const [showOptions, setShowOptions] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment.textContent);
  const [showModal, setShowModal] = useState(false)

  let userName = ""
  let text = ""
  let likes = 0

  if (comment) {
    userName = comment.ownerUserName
    text = comment.textContent
    likes = comment.likes
  }

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    setIsEditing(true);
  }

  const handleCommentChange = (event) => {
    event.stopPropagation();
    setNewComment(event.target.value);
  }

  const handleCommentSubmit = (event) => {
    if (event.key === "Enter") {
      if (newComment === text || newComment === "") {
        setIsEditing(false);
        setNewComment(text);
        return;
      }
      post.editComment(post.currentPost._id, newComment, index);
      setIsEditing(false);
    }
  }

  const onDeleteClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    setShowModal(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    post.deleteComment(post.currentPost._id, index);
    setShowModal(false);
  };

  const timeSinceCommentCreated = (commentTimestamp) => {
    const now = new Date();
    const commentDate = new Date(commentTimestamp);
  
    const timeDifference = now - commentDate;
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
    <div className="comment-container">
      <div className="comment-header">
        <div className="comment-details">
          <div className="comment-avatar">
            <span className="material-icons">account_circle</span>
            <span></span>
          </div>
          <div className="comment-header">
            <span className="comment-username"> {userName} • {timeSinceCommentCreated(comment.createdAt)}</span>
          </div>
        </div>
        <div className="comment-options">
        {(auth.user && auth.user.userName === userName) && (
          <span className="material-icons comment-options" onClick={() => setShowOptions(!showOptions)}>more_vert</span>
        )}
          {showOptions && (
            <div className="dropdown">
              <div className="dropdown-list">
                <div className="dropdown-option" onClick={handleEditClick}>
                  <span className="material-icons option-icon">edit</span>
                  <span>Edit</span>
                </div>
                <div className="dropdown-option" onClick={onDeleteClick}>
                  <span className="material-icons option-icon">delete</span>
                  <span>Delete</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="comment-body">
          {isEditing ? (
              <input
                className="comment-body-input"
                value={newComment}
                onClick={(e) => e.stopPropagation()}
                onChange={handleCommentChange}
                onKeyDown={handleCommentSubmit}
                autoFocus
              />
            ) : (
              <div className="comment-content">{text}</div>
          )}
        <div className="comment-footer">
          <button className="comment-likes"><span className="material-icons">favorite</span> {likes}</button>
        </div>
      </div>
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

function CommentThread({comment, replies, index}) {
  return (
    <div className="comment-thread">
      <Comment comment={comment} index={index} />
      <div className="comment-replies">
        {replies.map((reply, index) => (
          <Comment key={index} text={reply} />
        ))}
      </div>
    </div>
  );
}

export default CommentThread