import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import DOMPurify from 'dompurify';
import "react-quill/dist/quill.snow.css";
import "../static/css/post.css";
import { useNavigate, useParams } from "react-router";
import GlobalPostContext from "../contexts/post";
import GlobalMapContext  from "../contexts/map";
import { getAllTags } from "../utils/utils";
import AuthContext from "../auth";

const EditPostScreen = () => {
  const navigate = useNavigate();
  const { post } = useContext(GlobalPostContext);
  const { map } = useContext(GlobalMapContext)
  const { auth } = useContext(AuthContext);
  // id can be post id or map id
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [postTags, setPostTags] = useState([]);
  const [availTags, setAvailTags] = useState(getAllTags());
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editType = queryParams.get('type');

  useEffect(() => {
    // const loadPostData = async () => {
    //   try {
    //     if (!loaded) {
    //       if (post.currentPost && post.curren) {
    //         setTitle(post.currentPost.title)
    //         setContent(post.currentPost.textContent)
    //         post.currentPost.tags.forEach((tag) => addTag(tag))
    //       }

    //     }
    //     setLoaded(true);
    //   } catch (error) {
    //     console.error("Failed to load post: ", error);
    //   }
    // };
    if (!loaded) {
      if (
        post.currentPost &&
        auth.loggedIn &&
        post.currentPost.owner === auth.user.userId
      ) {
        setTitle(post.currentPost.title);
        setContent(post.currentPost.textContent);
        post.currentPost.tags.forEach((tag) => addTag(tag));
      }
      setLoaded(true);
    }
  }, [post.currentPost]);

  const handleTitleChange = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    const cleanContent = DOMPurify.sanitize(value);
    setContent(cleanContent);
    // try {
    //   const parser = new DOMParser();
    //   const parsedHtml = parser.parseFromString(value, "text/html");
    //   textContent = parsedHtml.body.textContent;
    // } catch (err) {
    //   console.error(err);
    // }
    // if (textContent !== content) {
    //   setContent(textContent);
    // }
  };

  const addTag = (tagToAdd) => {
    if (postTags.indexOf(tagToAdd) === -1) {
      setPostTags([...postTags, tagToAdd]);
    }
    setAvailTags(availTags.filter((tag) => tag !== tagToAdd));
  };

  const removeTag = (tagToRemove) => {
    setPostTags(postTags.filter((tag) => tag !== tagToRemove));
    if (availTags.indexOf(tagToRemove) === -1) {
      setAvailTags([...availTags, tagToRemove]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if content is effectively empty, react quil empty placeholder is '<p><br></p>'
    const isContentEmpty = !content.trim() || content === '<p><br></p>';
    const isTitleEmpty = !title.trim() 
    
    if (isContentEmpty) {
      setErrorMessage("Error: No body content provided");
      return;
    }
    if (isTitleEmpty) {
      setErrorMessage("Error: No title provided");
      return;
    }
    setIsSubmitting(true); 
    const requestid = id !== undefined ? id : ""; 
    // type a: map id
    // type b: post id
    try { 
      let response;
      if (editType === 'a') {
        console.log('a')
        response = await post.createPost(title, content, attachments, postTags, requestid);
      } else if (editType === 'b'){
        //TODO: this can only edit title, body content 
        console.log('b')
        response = await post.editPost(requestid, title, content);
      } else {
        console.log('c')
        response = await post.createPost(title, content, attachments, postTags, requestid);
      }

      const {success, mapMetadataId, postId} = response
      if (!success) {
        throw new Error("unsuccessful response") // this seems a bit redundant, but idk if we needed to surround this with try catch in the first place
      }
      console.log(mapMetadataId)
      if (mapMetadataId) {
        await map.loadMap(mapMetadataId)
      }
      navigate(`/post/${postId}`)

    } catch (error) {
      console.error('Error posting:', error);
    }
    setIsSubmitting(false);
  };  

  const handleAttachmentAdd = async (e) => {
    e.preventDefault();
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.split(".").pop();
      if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
        alert("Only .png .jpeg or .jpg allowed");
        return;
      }
    }
    if (files.length > 0) {
      setAttachments([...attachments, ...files]);
    }
  };

  // something here didnt get deploy for some reason?
  //(auth.loggedIn && ((post.currentPost && auth.user.userId === post.currentPost.owner._id) || !post.currentPost))
  return (
    <div className="post-editor-container">
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
            <div className="post-add-ons">
              <div className="post-attachments">
                <div className="attachment-item"></div>
                {/* Can someone change the way the attachment cards look */}
                {attachments.map((file, index) => (
                  <div className="attachment-add" key={index}>
                    {" "}
                    {file.name}{" "}
                  </div>
                ))}
                <div className="attachment-add">
                  {/* <span className="material-icons attachment-add-icon">add</span> */}
                  {/* Can someone change the input button back to the plus icon */}
                  <input
                    type="file"
                    accept="*"
                    onChange={handleAttachmentAdd}
                    multiple={true}
                  />
                </div>
              </div>
              <div className="post-tags">
                <div className="tags-list">
                  {postTags.map((tag, index) => (
                    <span
                      key={index}
                      className="tag"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="error-message">
                {errorMessage}
              </div>
              <div className="post-button">
                <button id="editPostButton" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (editType === 'b' ? 'Editing Post...' : 'Posting...') : (editType === 'b' ? 'Edit Post' : 'Post')}
                </button>
              </div>
            </div>
          </div>
          <div className="tags-container">
            <div id="tag-title">Tags</div>
            <div className="avail-tags-list">
              <input type="text" placeholder="Search Tag" />
              <div className="avail-tags">
                {availTags.map((tag, index) => (
                  <span
                    key={index}
                    className="avail-tag"
                    onClick={() => addTag(tag)}
                  >
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
  );
};

export default EditPostScreen;
