import "../../static/css/post.css";
import { useContext } from "react";
import GlobalPostContext from "../../contexts/post";
import GlobalMapContext from "../../contexts/map";
function Post({postId}) {
  const {post} = useContext(GlobalPostContext)
  const { map } = useContext(GlobalMapContext)
  let userName = ""
  let content = ""
  let title = ""
  let images = []
  if (post.currentPost) {
    userName = post.currentPost.ownerUserName
    content = post.currentPost.textContent
    title = post.currentPost.title
    images = post.currentPost.images
  }
  
  const handleSubmitComment =  (e) => {
    e.preventDefault()
    post.createComment(postId, e.target[0].value)
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
      <div className="post-content">
          {content}
          {images.length > 0 ? images.map( (image, index) => <img src={generateImageSrc(image)} alt={`img ${index} of this post`}/>) : null}
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