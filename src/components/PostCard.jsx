import '../static/css/postCard.css'

function PostCard(){
    return(
        <div className='postCardWrapper'>
            <img className="postCardImagePreview"></img>
            <div className="postCardDescription">
                <div className='postCardTitle'>Post Title Post Title Post Title</div>
                <div className='postCardDescription2'>
                    <div>username</div>
                    <div className="dividerCircle"></div>
                    <div>4d</div>
                    <button className="tag">Tag One</button>
                </div>
            </div>
            <div className='postCardButtons'>
                <button className='postCardButton'><span className="material-icons">favorite</span>32</button>
                <button className='postCardButton'><span className="material-icons">mode_comment</span>32</button>
            </div>
        </div>
    )
}

export default PostCard