import "../../static/css/post.css";

function Post() {

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="post-details">
          <h2>Post Title</h2>
          <span className="post-username">username • 4d</span>
        </div>
        <span className="material-icons fork-button">fork_right</span>
      </div>
      <div className="post-content">
          Contrary to divopular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
          Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
          a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
          classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
          "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.
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
        <div class="post-add-comment">
          <input id="commentInput" type="text" placeholder="Add Comment" />
          <button type="submit">
            <span className="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Post