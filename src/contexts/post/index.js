import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './post-request-api'
import AuthContext from '../../auth'

export const GlobalPostContext = createContext({});
export const GlobalPostActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
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
    });

    const navigate = useNavigate();
    const location = useLocation()
    const { auth } = useContext(AuthContext);
    const postReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalPostActionType.CHANGE_LIST_NAME: {
                return setPost({})
            }
        }
    }

    post.deleteComment = async (id) => {
        api.deleteComment()
    }
    
    post.deletePost = async (id) => {
        api.deletePost()
    }

    post.editComent = async (id, comment, index) => {
        api.editComment()
    }

    post.editPost = async (id, title, textContent) => {
        api.editPost()
    }

    // load a specific post's details
    post.loadPost = async (id) => {
        api.getPostData()
    }

    post.loadPostCards = async (options) => {

        api.getMostLikedPosts()
        api.getMostRecentPosts()
        api.getPostsOwnedByUser()
    }

    post.searchPosts = async (options) => {
        api.searchPostsByTags()
        api.searchPostsByTitle()
    }

    post.createPost = async (title, textContent, images) => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('textContent', textContent)
        if (images) {
            for (let i=0; i<images.length; i++) {
                formData.append(images[i])
            }
        }




    }
    
    post.createComment = async (comment) => {
        api.commentOnPost()
    }

    post.updatePostLikes = async (id) => {
        api.updatePostLikes()
    }

}
