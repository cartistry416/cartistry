import "../../static/css/post.css";
import { useContext, useRef, useState } from "react";
import GlobalPostContext from "../../contexts/post";
import GlobalMapContext from "../../contexts/map";
import AuthContext from "../../auth";
import AlertModal from "../modals/AlertModal";
import { formatTime } from "../HomeWrapper/HomeWrapper";
import { useNavigate } from "react-router";

function Post({postId}) {
  const { auth } = useContext(AuthContext)
  const {post} = useContext(GlobalPostContext)
  const { map } = useContext(GlobalMapContext)
  const formRef = useRef()
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  let userName = ""
  let content = ""
  let title = ""
  let images = []
  let likes = 0
  let comments = 0
  let time = ""
  let ownerId = 0
  if (post.currentPost) {
    userName = post.currentPost.ownerUserName
    content = post.currentPost.textContent
    title = post.currentPost.title
    images = post.currentPost.images
    likes = post.currentPost.likes
    comments = post.currentPost.comments
    time = formatTime(post.currentPost.createdAt)
    ownerId = post.currentPost.owner
  }

  const alreadyLiked = auth.loggedIn && auth.likedPosts.has(postId)
  
  const handleSubmitComment =  (e) => {
    e.preventDefault()
    if(auth.loggedIn){
      post.createComment(postId, e.target[0].value)
      formRef.current.reset();
    }
    else{
      setErrorMessage("Please log in to comment")
      setShowError(true)
    }
  }

  const handleLikePost = async (e) => {
    e.stopPropagation();
    await post.updatePostLikes(postId)
  }

  const generateImageSrc = (image) => {
    const blob = new Blob([new Uint8Array(image.imageData.data)], { type: image.contentType })
    return URL.createObjectURL(blob)
  }

  const handleForkClick = async (e) => {
    e.preventDefault()
    await map.forkMap(post.currentPost.mapMetadata)
  }

  const handleReset = () => {
    setShowError(false)
  }

  const visitProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${userName}/${ownerId}`)
  }

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="post-details">
          <h2 className="post-title">{title}</h2>
          <div className="postCardDescription2">
            <div className="clickable" onClick={visitProfile}>{userName}</div>
            <div className="dividerCircle"></div>
            <div>{time}</div>
          </div>
        </div>
        {post.currentPost && post.currentPost.mapMetadata ?
        <>
          <span className="material-icons fork-button" onClick={handleForkClick}>fork_right</span>
          {/* strange, this number doesn't increment <div> {`${post.currentPost.forks}`}</div> */}
        </> : null}
      </div>
      {/*using dangerouslySetInnerHTML, but DOMPurify usd in posteditor to mitigate risks*/}
      <div className="post-content">
          <div className="post-body" dangerouslySetInnerHTML={{ __html: content }} />
          {images.length > 0 && images.map((image, index) => 
              <img key={index} src={generateImageSrc(image)} alt={`img ${index} of this post`} />
          )}
      </div>
      <div className="post-footer">
        <div className="post-interactions">
          <button className={`${alreadyLiked ? "liked" : ""} like-button`} onClick={handleLikePost}>
            <span className="material-icons">favorite</span> {likes}
          </button>
          <button className="comment-button">
            <span className="material-icons">mode_comment</span> {comments ? comments.length : 0}
          </button>
        </div>
        <form ref={formRef} onSubmit={handleSubmitComment}>
          <div className="post-add-comment">
              <input id="commentInput" type="text" placeholder="Add Comment" />
              <button type="submit" >
                <span className="material-icons">send</span>
              </button>
          </div>
        </form>
      </div>
      {showError && (
          <AlertModal errorMessage={errorMessage} onCancel={() => setShowError(false)} onReset={handleReset} />
        )}
    </div>
  )
}

export default Post