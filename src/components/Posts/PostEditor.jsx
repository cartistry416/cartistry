import { useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../static/css/post.css";
import { useNavigate } from 'react-router';
import GlobalPostContext from '../../contexts/post';
import { at } from 'lodash';


const PostEditor = () => {
  const navigate = useNavigate();
  const {post} = useContext(GlobalPostContext)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postTags, setPostTags] = useState(["Tag Five", "Tag Three"])
  const [availTags, setAvailTags] = useState(["Tag One", "Tag Thrity", "Tag Eighty One", "Tag Six", "Tag Two", "Tag Seventeen", "Tag Nine"])


  const [attachments, setAttachments] = useState([])

  const handleTitleChange = (e) => {
    e.preventDefault()
    setTitle(e.target.value)
  }
  const handleContentChange = (value) => {
    let textContent = value
    try {
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(value, 'text/html');
      textContent = parsedHtml.body.textContent
    }
    catch(err) {
      console.error(err)
    }
    if (textContent !== content) {
      setContent(textContent)
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    await post.createPost(title, content, attachments, postTags)


    // navigate('/home')
  }

  const handleAttachmentAdd = async (e) => {
    e.preventDefault()
    const files = e.target.files

    for (let i=0; i<files.length; i++) {
      const ext = files[i].name.split('.').pop()
      if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
        alert("Only .png .jpeg or .jpg allowed")
        return
      }
    }
    if (files.length > 0) {
      setAttachments([...attachments, ...files])
    }
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
            {/* Can someone change the way the attachment cards look */}
            {
              attachments.map( (file, index) => <div className="attachment-add" key={index}> {file.name} </div>)
            }
            <div className="attachment-add">
              {/* <span className="material-icons attachment-add-icon">add</span> */}
              {/* Can someone change the input button back to the plus icon */}
              <input type="file" accept='*' onChange={handleAttachmentAdd} multiple={true}/>
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