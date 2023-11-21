import CommentThread from './CommentThread'
import Post from './Post'
import "../../static/css/post.css";
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState} from 'react';
import GlobalPostContext from '../../contexts/post';
import GeoJSONMap from '../GeoJSONMap';

function PostScreen() {

  const {id} = useParams()
  const {post} = useContext(GlobalPostContext)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    post.loadPost(id).then(() => {
      setLoaded(true)
    })
  }, [])

  useEffect(() => {

  }, [post.currentPost])


  let comments = <div> </div>
  if (post.currentPost && post.currentPost.comments.length > 0) {
    console.log(post.currentPost.comments)
    comments = post.currentPost.comments.map((comment, index) => <CommentThread comment={comment} key={index} replies={[]}> </CommentThread>)
  }

  let map = <div className='post-img' />

  if (post.currentPost && post.currentPost.mapMetadata !== "") {
    console.log("we have map metadata")
    map = <GeoJSONMap mapMetadataId={post.currentPost.mapMetadata} position={[39.74739, -105]}/>
  }

  const replies = [];
  return (
    <div className='post-wrapper'>
      <div className='post-content-wrapper'>
        <Post postId={id}/>
        {comments}
      </div>
      <div className='post-image-wrapper'>
        {map}
      </div>
    </div>
  )
}

export default PostScreen