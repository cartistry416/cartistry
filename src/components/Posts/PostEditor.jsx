import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../static/css/post.css";
import { useNavigate } from 'react-router';

const PostEditor = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postTags, setPostTags] = useState(["Tag Five", "Tag Three"])
  const [availTags, setAvailTags] = useState(["Tag One", "Tag Thrity", "Tag Eighty One", "Tag Six", "Tag Two", "Tag Seventeen", "Tag Nine"])

  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleContentChange = (value) => setContent(value)

  const addTag = (tagToAdd) => {
    if (postTags.indexOf(tagToAdd) === -1) {
      setPostTags([...postTags, tagToAdd])
    }
    setAvailTags(availTags.filter(tag => tag !== tagToAdd))
  }

  const removeTag = (tagToRemove) => {
    setPostTags(postTags.filter(tag => tag !== tagToRemove))
    if (availTags.indexOf(tagToRemove) === -1) {
      setAvailTags([...availTags, tagToRemove])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(title, content, postTags)
    navigate('/home')
  }

  return (
    <div className='post-editor-container'>
      <div className="create-post">
        <input 
          type="text" 
          value={title} 
          onChange={handleTitleChange} 
          placeholder="Title here..." 
          className="title-input"
        />
        <ReactQuill value={content} onChange={handleContentChange} />
        <div className='post-add-ons'>
          <div className='post-attachments'>
            <div className="attachment-item">
            </div>
            <div className="attachment-add">
              <span className="material-icons attachment-add-icon">add</span>
            </div>
          </div>
          <div className="post-tags">
            <div className='tags-list'>
              {postTags.map((tag, index) => (
                <span key={index} className="tag" onClick={() => removeTag(tag)}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className='post-button'>
            <button onClick={handleSubmit}>Post</button>
          </div>
        </div>
      </div>
      <div className='tags-container'>
        <div id="tag-title">Tags</div>
        <div className='avail-tags-list'>
          <input type="text" placeholder="Search Tag" />
          <div className="avail-tags">
            {availTags.map((tag, index) => (
              <span key={index} className="avail-tag" onClick={() => addTag(tag)}>
                {tag} <span className="material-icons">add</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostEditor