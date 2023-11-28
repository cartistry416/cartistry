import "../../static/css/post.css";
import { useContext, useRef } from "react";
import GlobalPostContext from "../../contexts/post";
import GlobalMapContext from "../../contexts/map";
import AuthContext from "../../auth";
function Post({postId}) {
  const { auth } = useContext(AuthContext)
  const {post} = useContext(GlobalPostContext)
  const { map } = useContext(GlobalMapContext)
  const formRef = useRef()

  let userName = ""
  let content = ""
  let title = ""
  let images = []
  let likes = 0
  let comments = 0
  if (post.currentPost) {
    userName = post.currentPost.ownerUserName
    content = post.currentPost.textContent
    title = post.currentPost.title
    images = post.currentPost.images
    likes = post.currentPost.likes
    comments = post.currentPost.comments.length
  }

  const alreadyLiked = auth.loggedIn && auth.likedPosts.has(postId)
  
  const handleSubmitComment =  (e) => {
    e.preventDefault()
    post.createComment(postId, e.target[0].value)
    formRef.current.reset();
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

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="post-details">
          <h2>{title}</h2>
          <span className="post-username">{userName} • 4d</span>
        </div>
        {post.currentPost && post.currentPost.mapMetadata ?
        <>
          <span className="material-icons fork-button" onClick={handleForkClick}>fork_right</span>
          {/* strange, this number doesn't increment <div> {`${post.currentPost.forks}`}</div> */}
        </> : null}
      </div>
      {/*using dangerouslySetInnerHTML, but DOMPurify usd in posteditor to mitigate risks*/}
      <div className="post-content">
          <div dangerouslySetInnerHTML={{ __html: content }} />
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
            <span className="material-icons">mode_comment</span> {comments}
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
    </div>
  )
}

export default Post