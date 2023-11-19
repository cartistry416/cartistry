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
    return api.get(`/posts-api/posts/search-title`, { params: { limit, title } })
}

export const searchPostsByTags = (tags, limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/search-tags`, { params: { limit, tags } })
}

export const getPostsOwnedByUser = (userId, limit) => {
    if (!limit) {
        limit = 20
    }
    return api.get(`/posts-api/posts/${userId}`,  { params: { limit } })
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
    return api.get(`/posts-api/posts/most-liked`,  { params: { limit } }) 
}

export const createPost = (formData) => {
    return api.post(`/posts-api/posts`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}


export const updatePostLikes = (id) => {
    return api.put(`/posts/${id}/likes`)
}

export const commentOnPost = (id, comment) => {
    return api.put(`/posts/${id}/comment`, {
        comment
    })
}

// TODO
// going to have to refractor and deal with editing images
export const editPost = (id, title, textContent) => {
    return api.put(`/posts/${id}`,{
        title, textContent
    })
}

export const editComment = (id, comment, index) => {
    return api.put(`/posts/${id}/edit-comment`, {
        comment, index
    })
}

export const deletePost = (id) => {
    return api.delete(`/posts/${id}`)
}

export const deleteComment = (id, index) => {
    api.delete(`/posts/${id}/comment`, {
        index
    })
}



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
    editComment
}

export default apis