import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './map-request-api'
import AuthContext from '../../auth'
import jsTPS from '../../common/jsTPS'
import { generateDiff, unzipBlobToJSON, jsonToZip} from '../../utils/utils'


export const GlobalMapContext = createContext({});
export const GlobalMapActionType = {
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

const tps = new jsTPS();

// const CurrentModal = {
//     NONE : "NONE",
//     DELETE_LIST : "DELETE_LIST",
//     EDIT_SONG : "EDIT_SONG",
//     REMOVE_SONG : "REMOVE_SONG"
// }
const mapReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
        // LIST UPDATE OF ITS NAME
        case GlobalMapActionType.CHANGE_LIST_NAME: {
            return setMap({
              ...map,
              mapCardsInfo: payload.mapCards,
            })
        }
        default:
          return map;
    }
}

function GlobalMapContextProvider(props) {
    const [map, setMap] = useState({
        currentModal : CurrentModal.NONE,
        mapCardsInfo: [],
        currentMapGeoJSONOriginal: null,
        currentMapGeoJSON: null,
        currentMapProprietaryJSON: null,
        currentMapProprietaryJSONOriginal: null,
        mapCardIndexMarkedForDeletion: null,
        mapCardMarkedForDeletion: null,
    });

    const navigate = useNavigate();
    const location = useLocation()
    const { auth } = useContext(AuthContext);
    const mapReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalMapActionType.CHANGE_LIST_NAME: {
                return setMap({})
            }
        }
    }
    // load all map cards associated with a user
    map.loadMapCards = async (userId) => {
        try {
        let response;
        if (auth.loggedIn && auth.user.userId === userId) {
            response = await api.getMapMetadataOwnedByUser(userId)
        } else {
            response = await api.getPublicMapMetadataOwnedByUser(userId)
        }
        if (response.status === 200) {
            mapReducer({
            type: MapActionType.LOAD_MAP_CARDS,
            payload: { mapCards: response.data.mapMetadatas }
            })
        }
        } catch (error) {
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.loadMap = async (id) => {
        try {
            const response = await api.getMapData(id)
            if (response.status === 200) {
                const geoJSON = await unzipBlobToJSON(response.data)
                mapReducer({
                    type: MapActionType.LOAD_MAP,
                    payload: {geoJSON}
                })
            }
        }
        catch (err) {
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.uploadMap = async (title, fileExtension, templateType, zipFileBlob) => {
        const formData = new FormData()
        formData.append('zipFile', zipFileBlob)
        formData.append('fileExtension', fileExtension)
        formData.append('title', title)
        formData.append('templateType', templateType)

        try {
            const response = await api.uploadMap(formData)
            if (response.status === 200) {
                navigate(`/editMap/${response.data.mapMetadataId}`)
            }

        }
        catch (error) { 
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.renameMap = async (id, title, index) => {
        try {
            const response = await api.renameMap(id, title)
            if (response.status === 200) {
                mapReducer({
                    type: MapActionType.RENAME_MAP,
                    payload: {index, title}
                })
            }
        }
        catch (error) {
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.forkMap = async (id) => {
        try {
            const response = await api.forkMap(id)
            if (response.status === 200) {
                navigate(`/editMap/${response.data.mapMetadataId}`)
            }
        }
        catch (error) {
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }

    }
    
    // The backend route for exporting maps only allows exporting public maps.
    // If a user tries to export their own map, they should just use api.getMapData instead.
    map.exportMap = async (mapId, userId) => {
        let zipData = null
        if (map.currentMapGeoJSON) {
            zipData = await jsonToZip(map.currentMapGeoJSON)
        }
        else {
            try {
                let response; 
                if (auth.loggedIn && auth.user.userId === userId) {
                    response = await api.getMapData(mapId)
                }
                else {
                    response = await api.exportMap(mapId)
                }
    
                if (response.status === 200) { 
                    zipData = new Blob([response.data], {type: 'application/zip'})
                }
            }
            catch (error) {
                mapReducer({
                    type: MapActionType.ERROR_MODAL,
                    payload: { hasError: true, errorMessage: error.response.data.errorMessage }
                })
            }
        }
        try {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'geoJSON.zip';
            link.click()
            document.body.removeChild(link)
        }
        catch (err) {
            console.error("Unable to download zip file: " + err)
        }
    }
    map.favoriteMap = async (id, index) => {
        try {
            const response = await api.favoriteMap(id)
            if (response.status === 200) {
                mapReducer({
                    type: MapActionType.FAVORITE_MAP,
                    payload: { index }
                })
            }
        }
        catch (error) {
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }


    map.deleteMap = (id) => {}
    map.updateMapPrivacy = (id, privacyStatus) => {}
    map.saveMapEdits = async (id) => {

        const delta1 = generateDiff(map.currentMapGeoJSONOriginal, map.currentMapGeoJSON)
        const delta2 = generateDiff(map.currentMapProprietaryJSONOriginal, map.currentMapProprietaryJSON)
        if (!delta1 && !delta2) {
            console.error("no deltas created. Was the map even edited to begin with?")
            return
        }

        try {
            const proprietaryJSON = delta2 ? currentMapProprietaryJSON : null
            const response = await api.saveMapEdits(id, delta1, proprietaryJSON)
            if (response.status === 200) {
                tps.clearAllTransactions()
                alert("Map edits saved successfully. Clearing TPS stack and setting original geoJSON to current geoJSON")
                mapReducer({
                    type: MapActionType.SAVE_MAP_EDITS, // in the reducer, update original geoJSON and original proprietary geoJSON
                    payload: {}
                })
            }

        }
        catch (error) {
            mapReducer({
                type: MapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.publishMap = (id) => {}

    map.addEditFeaturePropertiesTransaction = (newProperties, oldProperties, index) => {
        
    }
    map.addCreateFeatureTransaction = (newFeature, index) => {

    } 
    map.addDeleteFeatureTransaction = (feature, index) => {

    }


    map.canUndo = function() {
        return ((map.currentMapGeoJSONOriginal !== null) && tps.hasTransactionToUndo())
    }
    map.canRedo = function() {
        return ((map.currentMapGeoJSONOriginal !== null) && tps.hasTransactionToRedo())
    }
}
