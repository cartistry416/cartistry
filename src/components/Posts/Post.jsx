import "../../static/css/post.css";
import { useContext } from "react";
import GlobalPostContext from "../../contexts/post";
function Post({postId}) {
  const {post} = useContext(GlobalPostContext)

  let userName = ""
  let content = ""
  
  if (post.currentPost) {
    userName = post.currentPost.ownerUserName
    content = post.currentPost.textContent
  }
  
  const handleSubmitComment =  (e) => {
    e.preventDefault()
    post.createComment(postId, e.target[0].value)
  }

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="post-details">
          <h2>Post Title</h2>
          <span className="post-username">{userName} • 4d</span>
        </div>
        <span className="material-icons fork-button">fork_right</span>
      </div>
      <div className="post-content">
          {content}
      </div>
      <div className="post-footer">
        <div className="post-interactions">
          <button className="like-button">
            <span className="material-icons">favorite</span> 75
          </button>
          <button className="comment-button">
            <span className="material-icons">mode_comment</span> 12
          </button>
        </div>
        <form onSubmit={handleSubmitComment}>
          <div className="post-add-comment">
              <input id="commentInput" type="text" placeholder="Add Comment" />
              <button type="submit" >
                <span className="material-icons">send</span>
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Post