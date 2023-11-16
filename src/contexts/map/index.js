import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './map-request-api'
import AuthContext from '../../auth'
import jsTPS from '../../common/jsTPS'
import { generateDiff } from '../../utils/utils'


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


function GlobalMapContextProvider(props) {
    const [map, setMap] = useState({
        currentModal : CurrentModal.NONE,
        mapCardsInfo: [],
        currentMapGeoJSONOriginal: null,
        currentMapGeoJSON: null,
        currentMapProprietaryJSON: null,
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
    map.loadMapCards = (id) => {
        // if the user id is not the currently logged in user, get only the public map cards
        if (auth.loggedIn && auth.user.userId === id) {
            api.getMapMetadataOwnedByUser()
        }
        else {
            api.getPublicMapMetadataOwnedByUser()
        }
    }

    map.loadMap = (id) => {
        api.getMapData()
    }

    map.uploadMap = (formData) => {
        api.uploadMap()
    }

    map.renameMap = (id, title) => {}

    map.forkMap = (id) => {}
    
    map.exportMap = (id) => {}
    map.favoriteMap = (id) => {}
    map.deleteMap = (id) => {}
    map.updateMapPrivacy = (id, privacyStatus) => {}
    map.saveMapEdits = (id) => {}
    map.publishMap = (id) => {}

    map.addEditFeaturePropertiesTransaction = (newProperties, oldProperties, index) {

    }
    map.addCreateFeatureTransaction = (newFeature, index) {
        
    } 


    map.canUndo = function() {
        return ((store.currentMapGeoJSONOriginal !== null) && tps.hasTransactionToUndo())
    }
    map.canRedo = function() {
        return ((store.currentMapGeoJSONOriginal !== null) && tps.hasTransactionToRedo())
    }

}
