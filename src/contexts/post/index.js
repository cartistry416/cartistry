import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './post-request-api'
import AuthContext from '../../auth'

export const GlobalPostContext = createContext({});
export const GlobalPostActionType = {
    DELETE_COMMENT: "DELETE_COMMENT",
    DELETE_POST: "DELETE_POST", 
    EDIT_COMMENT: "EDIT_COMMENT",
    EDIT_POST: "EDIT_POST",
    LOAD_POST: "LOAD_POST",
    LOAD_POST_CARDS: "LOAD_POST_CARDS",
    CREATE_COMMENT: "CREATE_COMMENT",
    UPDATE_POST_LIKES: "UPDATE_POST_LIKES",
    HIDE_MODALS: "HIDE_MODALS",
}

const CurrentModal = {
  NONE : "NONE",
  ERROR: "ERROR"
  // DELETE_LIST : "DELETE_LIST",
  // EDIT_SONG : "EDIT_SONG",
  // REMOVE_SONG : "REMOVE_SONG"
}

function GlobalPostContextProvider(props) {
    const [post, setPost] = useState({
        currentModal : CurrentModal.NONE,
        postCardsInfo: [],
        currentPost: {}, 
        postCardIndexMarkedForDeletion: null,
        postCardMarkedForDeletion: null,
        commentIndexMarkedForDeletion: null,
        commentMarkedForDeletion: null,
    });

    const navigate = useNavigate();
    const location = useLocation()
    const { auth } = useContext(AuthContext);
    const postReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalPostActionType.DELETE_COMMENT: {
                const updatedCurrentPost = {...post.currentPost}
                updatedCurrentPost.comments.splice(payload.index, 1)
                return setPost({
                    ...post,
                    currentPost: updatedCurrentPost
                })
            }
            case GlobalPostActionType.DELETE_POST: {
                const updatedPostCardsInfo = post.postCardsInfo.filter(card => card._id !== payload.id)
                return setPost({
                    ...post,
                    postCardsInfo: updatedPostCardsInfo
                })
            }
            case GlobalPostActionType.EDIT_COMMENT: {
                const updatedCurrentPost = {...post.currentPost}
                updatedCurrentPost.comments[payload.index] = payload.comment
                return setPost({
                    ...post,
                    currentPost: updatedCurrentPost
                })
            }
            case GlobalPostActionType.LOAD_POST: {
                const newPost = payload.post || {}; // Fallback to an empty object if undefined
                return setPost({
                    ...post,
                    currentPost: newPost
                })
            }
            
            case GlobalPostActionType.LOAD_POST_CARDS: {
                return setPost({
                    ...post,
                    postCardsInfo: payload.postCards
                });
            }
            case GlobalPostActionType.CREATE_COMMENT: {
                const updatedCurrentPost = {...post.currentPost}
                updatedCurrentPost.comments.splice(payload.index, 0, payload.comment)
                return setPost({
                    ...post,
                    currentPost: updatedCurrentPost
                })
            }
            case GlobalPostActionType.UPDATE_POST_LIKES: {
                const updatedPostCardsInfo = [...post.postCardsInfo]
                const updateIndex = post.postCardsInfo.findIndex(card => card._id === payload.id)
                if (updateIndex !== -1) {
                    updatedPostCardsInfo[updateIndex]["alreadyLiked"] = payload.alreadyLiked
                    updatedPostCardsInfo[updateIndex].likes = payload.likes
                }
                return setPost({
                    ...post,
                    postCardsInfo: updatedPostCardsInfo
                })
            }

            default:
              return
        }
    }

    post.deleteComment = async (id, index) => {
        try {
            const response = await api.deleteComment(id, index)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.DELETE_COMMENT,
                    payload: { id, index }
                })
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }
    
    post.deletePost = async (id) => {
        try {
            const response = await api.deletePost(id)
            if (response.status === 200) {
                if (location.pathname.startsWith("/post")) {
                    navigate('/home')
                    return
                }
                postReducer({
                    type: GlobalPostActionType.DELETE_POST,
                    payload: { id }
                })
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    post.editComment = async (id, comment, index) => {
        try {
            const response = await api.editComment(id, comment, index)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.EDIT_COMMENT,
                    payload: { id, comment, index }
                })
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    post.editPost = async (id, title, textContent) => {

        try {
            const response = await api.editPost(id, title, textContent)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.LOAD_POST,
                    payload: {post: response.data.post}
                })
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }

    }

    // load a specific post's details
    post.loadPost = async (id) => { 
        try {
            let response = await api.getPostData(id)
            if (response.status !== 200) {
                return 
            }
            postReducer({
                type: GlobalPostActionType.LOAD_POST,
                payload: { post: response.data.post }
            })
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    post.loadPostCards = async (type, limit) => {
        try {
            let response;
            if (type === "mostLiked") {
                response = await api.getMostLikedPosts(limit)
            }
            else if (type === "mostRecent") {
                response = await api.getMostRecentPosts(limit)
            }
            else if (type === "owned") {
                response = await api.getPostsOwnedByUser(limit)
            } 
            else {
                console.error("Unknown type of post card loading")
            }

            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.LOAD_POST_CARDS,
                    payload: { postCards: response.data.posts }
                }) 
            }

        }
        catch (error) {
            const errorMessage = error?.response?.data?.errorMessage || "An unexpected error occurred";
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: errorMessage }
            })
        }        
    }

    post.searchPostsByTags = async (tags, limit) => {
        try {
            const response = await api.searchPostsByTags(tags, limit)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.LOAD_POST_CARDS,
                    payload: { postCards: response.data.posts }
                }) 
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
        
    }
    post.searchPostsByTitle = async (title, limit) => {

        try {
            const response = await api.searchPostsByTitle(title, limit)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.LOAD_POST_CARDS,
                    payload: { postCards: response.data.posts }
                }) 
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    post.createPost = async (title, textContent, images, tags, mapMetadataId) => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('textContent', textContent)
        formData.append('tags', tags)
        if (mapMetadataId !== "") {
            formData.append('mapMetadataId', mapMetadataId)
        }
        if (images) {
            const fileExtensions = []
            for (let i=0; i<images.length; i++) {
                formData.append('images', images[i])
                fileExtensions.push(images[i].name.split('.').pop())
            }
            formData.append('fileExtensions', fileExtensions)
        }
        try {
            const response = await api.createPost(formData)
            if (response.status === 200) {
                navigate(`/post/${response.data.postId}`)
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })  
        }
    }
    
    post.createComment = async (id, comment) => {
        try {
            const response = await api.commentOnPost(id,comment)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.CREATE_COMMENT,
                    payload: {comment: response.data.comment, index: response.data.index, id}
                })
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    post.updatePostLikes = async (id) => {
        try {
            const response = await api.updatePostLikes(id)
            if (response.status === 200) {
                postReducer({
                    type: GlobalPostActionType.UPDATE_POST_LIKES,
                    payload: { id, alreadyLiked: response.data.alreadyLiked, likes: response.data.likes }
                })
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    return (
      <GlobalPostContext.Provider value={{post}}>
          {props.children}
      </GlobalPostContext.Provider>
  )

}

export default GlobalPostContext ;
export { GlobalPostContextProvider };