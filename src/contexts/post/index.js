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

    post.deleteComment = (id) => {

    }
    
    post.deletePost = (id) => {

    }

    post.editComent = (id, newText) => {

    }

    post.editPost = (id, newPost) => {

    }

    // load a specific post's details
    post.loadPost = (id) => {

    }

    post.loadPostCards = (options) => {

        api.getMostLikedPosts()
        api.getMostRecentPosts()
        api.getPostsOwnedByUser()
    }

    post.searchPosts = (options) => {
        api.searchPostsByTags()
        api.searchPostsByTitle()
    }

    post.createPost = (post) => {

    }
    
    post.createComment = (comment) => {

    }

    post.updatePostLikes = (id) => {
        api.updatePostLikes()
    }

}
