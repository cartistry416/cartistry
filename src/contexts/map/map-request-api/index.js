import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV !== 'development' ? 'https://cartistry-express.vercel.app' : 'http://localhost:4000'

const api = axios.create({
    baseURL
})

export const exportMap = (id) => {
    return api.get(`/maps/${id}/export`, {
        responseType: 'arraybuffer'
    })
}

export const getMapMetadataOwnedByUser = () => {
    return api.get(`/maps/map-metadata`)
}
export const getPublicMapMetadataOwnedByUser = (id) => {
    return api.get(`/maps/public-map-metadata/${id}`)
}
export const getMapData = (id) => {
    return api.get(`/maps/${id}`, {
        responseType: 'arraybuffer'
    })
}

export const uploadMap = (formData) => {
    return api.post(`/maps-api/maps/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
export const publishMap = (id, postData) => {
    return api.post(`/maps/${id}/publish`, {
        postData
    })
}
export const forkMap = (id) => {
    return api.post(`/maps/${id}/fork`)
}
export const renameMap = (id, title) => {
    return api.put(`/maps-api/maps/${id}/rename`, {
        title
    })
}
export const favoriteMap = (id) => {
    return api.put(`/maps/${id}/favorite`)
}
export const updateMapPrivacy = (id) => {
    return api.put(`/maps/${id}/update-privacy`)
}
export const saveMapEdits = (id, delta, proprietaryJSON) => {
    return api.put(`/maps/${id}/save`, {
        delta,
        proprietaryJSON
    })
}

export const deleteMap = (id) => {
    return api.delete(`/maps/${id}`)
}

const apis = {
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
}
export default apis