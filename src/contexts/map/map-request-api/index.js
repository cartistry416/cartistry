import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV !== 'development' ? 'https://cartistry-express.vercel.app' : 'http://localhost:4000'

const api = axios.create({
    baseURL
})

export const uploadMap = (formData) => {
    return api.post(`/maps-api/maps/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
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