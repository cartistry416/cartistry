import { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../static/css/post.css";
import { useNavigate, useParams } from 'react-router';
import GlobalPostContext from '../../contexts/post';
import { getAllTags } from '../../utils/utils';


const PostEditor = () => {
  const navigate = useNavigate();
  const {post} = useContext(GlobalPostContext)
  const {mapMetadataId} = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [postTags, setPostTags] = useState([])
  const [availTags, setAvailTags] = useState(getAllTags())
  const [attachments, setAttachments] = useState([])

  useEffect(() => {
    const loadPostData = async () => {
      try {
        await post.loadpost(mapMetadataId);
        setTitle(post.currentPost.title || '');
            setContent(post.currentPost.textContent || '');
            setPostTags(post.currentPost.tags || []);
            setLoaded(true);
      } catch (error) {
        console.error("Failed to load post: ", error);
      }
    };

    loadPostData();
  }, [post, mapMetadataId])

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
    const id = mapMetadataId !== undefined ? mapMetadataId : ""
    await post.createPost(title, content, attachments, postTags, id)
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
      {loaded ? (
        <>
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
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default PostEditor