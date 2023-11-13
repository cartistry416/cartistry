import CommentThread from './CommentThread'
import Post from './Post'
import "../../static/css/post.css";

function PostScreen() {
  const mainComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam vulputate ut pharetra sit amet. Sit amet luctus venenatis lectus magna fringilla. Ac placerat vestibulum lectus mauris ultrices eros in cursus turpis.";
  const replies = [
    "Auctor urna nunc id cursus metus aliquam eleifend mi. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Habitasse platea dictumst vestibulum rhoncus. Leo a diam sollicitudin tempor.",
    "Mauris rhoncus aenean vel elit. Enim ut sem viverra aliquet eget sit. Varius vel pharetra vel turpis nunc eget lorem dolor. Pretium viverra suspendisse potenti nullam."
  ];
  return (
    <div className='post-wrapper'>
      <div className='post-content-wrapper'>
        <Post />
        <CommentThread comment={mainComment} replies={replies} />
        <CommentThread comment={mainComment} replies={replies} />
      </div>
      <div className='post-image-wrapper'>
        <div className='post-img' />
      </div>
    </div>
  )
}

export default PostScreen