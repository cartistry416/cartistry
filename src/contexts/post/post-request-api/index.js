import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV !== 'development' ? 'https://cartistry-express.vercel.app' : 'http://localhost:4000'

const api = axios.create({
    baseURL
})


export const searchPostsByTitle = (title, limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/search-tags${title}`, {
        limit
    })
}

export const searchPostsByTags = (tags, limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/search-tags`, {
        tags, 
        limit
    })
}

export const getPostsOwnedByUser = (userId, limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/${userId}`, {
        limit
    })
}

export const getPostData = (postId) => {
    return api.get(`/posts-api/posts/${postId}`) 
}

export const getMostRecentPosts = (limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/most-recent`,  { params: { limit } }) 
}

export const getMostLikedPosts = (limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/most-liked`, {
        limit
    }) 
}

export const createPost = (title, textContent, images) => {
    
    const formData = new FormData()

    for (let i=0; i<images.length; i++) {
        formData.append(images[i])
    }
    return api.post(`/posts-api/posts`, {
        title,
        textContent,
    })
}



export const deletePost = () => {}

export const updatePostLikes = () => {}

export const deleteComment = () => {}

export const commentOnPost = () => {} 

export const editPost = () => {}

const apis = {
    searchPostsByTitle,
    searchPostsByTags,
    getPostsOwnedByUser,
    getPostData,
    getMostRecentPosts,
    getMostLikedPosts,
    createPost,
    deletePost,
    updatePostLikes,
    deleteComment,
    commentOnPost,
    editPost,
}

export default apis