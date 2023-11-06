import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://cartistry-express.vercel.app',// http://localhost:4000',
})

export const searchPostsByTitle = (title, limit) => {
    return api.get(`/posts-api/posts/search-tags${title}`, {
        limit
    })
}

export const searchPostsByTags = (tags, limit) => {
    return api.get(`/posts-api/posts/search-tags`, {
        tags, 
        limit
    })
}

export const getPostsOwnedByUser = (userId, limit) => {
    return api.get(`/posts-api/posts/${userId}`, {
        limit
    })
}

export const getPost = (postId) => {
    return api.get(`/posts-api/posts/${postId}`) 
}

export const getMostRecentPosts = (limit) => {
    return api.get(`/posts-api/posts/most-recent`, {
        limit
    }) 
}

export const getMostLikedPosts = (limit) => {
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


export const uploadMap = (formData) => {
    return api.post(`/maps-api/maps/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
export const getDummyData = () => {
    return api.get('/') 
}

export const deletePost = () => {}

export const updatePostLikes = () => {}

export const deleteComment = () => {}

export const commentOnPost = () => {} 

export const editPost = () => {}

export const renameMap = () => {}
export const forkMap = () => {}
export const exportMap = () => {}
export const favoriteMap = () => {}
export const deleteMap = () => {}
export const updateMapPrivacy = () => {}
export const saveMapEdits = () => {}
export const publishMap = () => {}
export const getMapMetadataOwnedByUser = () => {}
export const getPublicMapMetadataOwnedByUser = () => {}
export const getMapData = () => {}
 
const apis = {
    createPost,
    deletePost,
    commentOnPost,
    updatePostLikes,
    getMostRecentPosts,
    getMostLikedPosts,
    getPost,
    getPostsOwnedByUser,
    searchPostsByTitle,
    searchPostsByTags,
    deleteComment,
    editPost,

    uploadMap,
    renameMap,
    forkMap,
    exportMap,
    favoriteMap,
    deleteMap,
    updateMapPrivacy,
    saveMapEdits,
    publishMap,
    getMapMetadataOwnedByUser,
    getPublicMapMetadataOwnedByUser,
    getMapData,
    getDummyData,
}

export default apis