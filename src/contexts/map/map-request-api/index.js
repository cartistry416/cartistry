import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV !== 'development' ? 'https://cartistry-express.vercel.app' : 'http://localhost:4000'

const api = axios.create({
    baseURL
})

export const exportMap = (id) => {
    return api.get(`/maps-api/maps/${id}/export`, {
        responseType: 'arraybuffer'
    })
}

export const getMapMetadataOwnedByUser = () => {
    return api.get(`/maps-api/maps/map-metadata`)
}
export const getPublicMapMetadataOwnedByUser = (id) => {
    return api.get(`/maps-api/maps/public-map-metadata/${id}`)
}

export const getMapMetadata = (id) => {
    return api.get(`/maps-api/maps/single-map-metadata/${id}`)
}
export const getMapData = (id) => {
    return api.get(`/maps-api/maps/${id}`, {
        responseType: 'arraybuffer'
    })
}
export const getMapProprietaryData = (id) => {
    return api.get(`/maps-api/maps/${id}/props`)
}

export const uploadMap = (formData) => {
    return api.post(`/maps-api/maps/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
export const publishMap = (id, postData) => {
    return api.post(`/maps-api/maps/${id}/publish`, postData)
}
export const forkMap = (id) => {
    return api.post(`/maps-api/maps/${id}/fork`)
}
export const renameMap = (id, title) => {
    return api.put(`/maps-api/maps/${id}/rename`, {
        title
    })
}
export const favoriteMap = (id) => {
    return api.put(`/maps-api/maps/${id}/favorite`)
}
export const updateMapPrivacy = (id) => {
    return api.put(`/maps-api/maps/${id}/update-privacy`)
}
export const saveMapEdits = (id, delta, proprietaryJSON, thumbnail, layersGeoJSON, gradientLayersGeoJSON, gradientOptions) => {
    return api.put(`/maps-api/maps/${id}/save`, {
        delta,
        proprietaryJSON,
        thumbnail,
        layersGeoJSON,
        gradientLayersGeoJSON,
        gradientOptions
    })
}

export const deleteMap = (id) => {
    return api.delete(`/maps-api/maps/${id}`)
}

export const searchMapsByTitle = (title, limit) => {
    if(!limit){
        limit = 20
    }
    return api.get(`/maps-api/maps/search-title`, {params: {limit, title} })
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
    getMapMetadata,
    searchMapsByTitle,
    getMapProprietaryData
}
export default apis