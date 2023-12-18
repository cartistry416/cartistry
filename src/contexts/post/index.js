import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api, { getMostRecentPosts } from './post-request-api'
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
    EXIT_CURRENT_POST: "EXIT_CURRENT_POST",
    SORT_POST_CARDS: "SORT_POST_CARDS",
    UPDATE_TAGS: "UPDATE_TAGS",
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
        currentPost: null, 
        postCardIndexMarkedForDeletion: null,
        postCardMarkedForDeletion: null,
        commentIndexMarkedForDeletion: null,
        commentMarkedForDeletion: null,
        selectedTags: [],
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
                updatedCurrentPost.comments[payload.index].textContent = payload.comment
                return setPost({
                    ...post,
                    currentPost: updatedCurrentPost
                })
            }
            case GlobalPostActionType.LOAD_POST: {
                return setPost({
                    ...post,
                    currentPost: payload.post
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
                const updatedCurrentPost = post.currentPost
                if (updateIndex !== -1) {
                    updatedPostCardsInfo[updateIndex].likes = payload.likes
                }
                if (post.currentPost) {
                  updatedCurrentPost.likes = payload.likes
                }
                return setPost({
                    ...post,
                    postCardsInfo: updatedPostCardsInfo,
                    currentPost: updatedCurrentPost
                })
            }
            case GlobalPostActionType.EXIT_CURRENT_POST: {
                return setPost({
                    ...post,
                    currentPost: null
                })
            }

            case GlobalPostActionType.SORT_POST_CARDS: {
                const updatedPostCardsInfo = [...post.postCardsInfo]
                if (payload.sortType === "mostRecent") {
                    updatedPostCardsInfo.sort((a, b) => {
                        const date1 = new Date(a.createdAt)
                        const date2 = new Date(b.createdAt)
                        return date2 - date1
                    })
                }
                else if (payload.sortType === "leastRecent") {
                    updatedPostCardsInfo.sort((a, b) => {
                        const date1 = new Date(a.createdAt)
                        const date2 = new Date(b.createdAt)
                        return date1 - date2
                    })
                }
                else if (payload.sortType === "liked") {
                    updatedPostCardsInfo.sort((a, b) => {
                        return b.likes - a.likes
                    })
                }
                console.log(updatedPostCardsInfo)
                return setPost({
                    ...post,
                    postCardsInfo: updatedPostCardsInfo
                })
            }
            
            case GlobalPostActionType.UPDATE_TAGS: {
                return setPost({
                    ...post,
                    selectedTags: payload.tags
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
                    postReducer({
                        type: GlobalPostActionType.EXIT_CURRENT_POST,
                        payload: { }
                    })
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
              console.log(comment)
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
                return { success: true, mapMetadataId: response.data.mapMetadataId, postId: response.data.postId }
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
            return { success: false, mapMetadataId: null, postId: null}
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
            if (type === "mostRecent") {
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
            let errorMessage = "An unexpected error occurred";
            if (error.response && error.response.data && error.response.data.errorMessage) {
                errorMessage = error.response.data.errorMessage;
            }
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: errorMessage }
            })
        }
    }


    post.sortBy = (type) => {
        postReducer({
            type: GlobalPostActionType.SORT_POST_CARDS,
            payload: {sortType: type}
        })
    }

    // post.searchPostsByTags = async (tags, limit) => {
    //     try {
    //         const response = await api.searchPostsByTags(tags, limit)
    //         if (response.status === 200) {
    //             postReducer({
    //                 type: GlobalPostActionType.LOAD_POST_CARDS,
    //                 payload: { postCards: response.data.posts }
    //             }) 
    //         }
    //     }
    //     catch (error) {
    //         postReducer({
    //             type: GlobalPostActionType.ERROR_MODAL,
    //             payload: { hasError: true, errorMessage: error.response.data.errorMessage }
    //         })
    //     }
        
    // }

    post.addFilterTag = (tagToAdd) => {
        let newSelectedTags;
        if (post.selectedTags.indexOf(tagToAdd) === -1) {
            newSelectedTags = [...post.selectedTags, tagToAdd]
            newSelectedTags.sort()
        }
        console.log(newSelectedTags)
        postReducer({
            type: GlobalPostActionType.UPDATE_TAGS,
            payload: { tags: newSelectedTags }
        })
      };
    
    post.removeFilterTag = (tagToRemove) => {
        const newSelectedTags = post.selectedTags.filter((tag) => tag !== tagToRemove).sort()
        postReducer({
            type: GlobalPostActionType.UPDATE_TAGS,
            payload: { tags: newSelectedTags }
        })
    };

    post.searchPostsByTitle = async (title, limit) => {

        try {
            let response;
            if (title === "") {
                response = await getMostRecentPosts(limit)
            }
            else {
                response = await api.searchPostsByTitle(title, limit)
            }

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

        if (mapMetadataId && mapMetadataId !== "") {
            formData.append('mapMetadataId', mapMetadataId)
        }
        if (images && images.length > 0) {
            for (let i=0; i<images.length; i++) {
                formData.append('images', images[i])
            }
        }
        try {
            const response = await api.createPost(formData)
            if (response.status === 200) {
                return { success: true, mapMetadataId: response.data.mapMetadataId, postId: response.data.postId }; // Indicate success
            } else {
                // Handle any other HTTP status codes as necessary
                return { success: false, errorMessage: 'An unexpected error occurred.' };
            }   
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })  
            return { success: false, errorMessage: error.response?.data?.errorMessage || error.message };

        }
    }
    
    post.createComment = async (id, comment) => {
        try {
            const response = await api.commentOnPost(id, comment, auth.user.userId)
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
                    payload: { id, likes: response.data.likes }
                })
                auth.updateLikedPosts(response.data.alreadyLiked, id)
            }
        }
        catch (error) {
            postReducer({
                type: GlobalPostActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    post.exitCurrentPost = () => {
        postReducer({
            type: GlobalPostActionType.EXIT_CURRENT_POST,
            payload: {}
        })
    }

    return (
      <GlobalPostContext.Provider value={{post}}>
          {props.children}
      </GlobalPostContext.Provider>
  )

}

export default GlobalPostContext ;
export { GlobalPostContextProvider };