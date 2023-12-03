import { useContext, useState } from "react";
import "../../static/css/comment.css";
import AuthContext from "../../auth";

function Comment({comment}) {
  const {auth} = useContext(AuthContext)
  const [showOptions, setShowOptions] = useState(false)


  let userName = ""
  let text = ""

  if (comment) {
    userName = comment.ownerUserName
    text = comment.textContent
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
            <span className="comment-username"> {userName} • 4d</span>
          </div>
        </div>
        <div className="comment-options">
        {(auth.user && auth.user.userName === userName) && (
          <span className="material-icons comment-options" onClick={() => setShowOptions(!showOptions)}>more_vert</span>
        )}
          {showOptions && (
            <div className="dropdown">
              <div className="dropdown-list">
                <div className="dropdown-option">
                  <span className="material-icons option-icon">edit</span>
                  <span>Edit</span>
                </div>
                <div className="dropdown-option">
                  <span className="material-icons option-icon">delete</span>
                  <span>Delete</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="comment-body">
        <div className="comment-content">{text}</div>
        <div className="comment-footer">
          <button className="comment-likes"><span className="material-icons">favorite</span> 75</button>
        </div>
      </div>
    </div>
  );
}

function CommentThread({comment, replies}) {
  return (
    <div className="comment-thread">
      <Comment comment={comment} />
      <div className="comment-replies">
        {replies.map((reply, index) => (
          <Comment key={index} text={reply} />
        ))}
      </div>
    </div>
  );
}

export default CommentThread