import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './map-request-api'
import AuthContext from '../../auth'
import jsTPS from '../../common/jsTPS'
import { generateDiff, unzipBlobToJSON, jsonToZip} from '../../utils/utils'
import _, { findIndex } from 'lodash'


export const GlobalMapContext = createContext({});
export const GlobalMapActionType = {
    DELETE_MAP: "DELETE_MAP",
    ERROR_MODAL: "ERROR_MODAL",
    FAVORITE_MAP: "FAVORITE_MAP",
    HIDE_MODALS: "HIDE_MODALS",
    LOAD_MAP: "LOAD_MAP",
    LOAD_MAP_CARDS: "LOAD_MAP_CARDS",
    PUBLISH_MAP: "PUBLISH_MAP",
    RENAME_MAP: "RENAME_MAP",
    SAVE_MAP_EDITS: "SAVE_MAP_EDITS",
    SET_CURRENT_MAP_METADATA: "SET_CURRENT_MAP_METADATA",
    UPDATE_MAP_PRIVACY: "UPDATE_MAP_PRIVACY",
    EXIT_CURRENT_MAP: "EXIT_CURRENT_MAP"
  }

const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    ERROR: "ERROR"
    // DELETE_LIST : "DELETE_LIST",
    // EDIT_SONG : "EDIT_SONG",
    // REMOVE_SONG : "REMOVE_SONG"
}

function GlobalMapContextProvider(props) {
    const [map, setMap] = useState({
        currentModal : CurrentModal.NONE,
        errorMessage: "",
        mapCardsInfo: [],
        currentMapMetadata: null,
        currentMapGeoJSONOriginal: null,
        currentMapGeoJSON: null,
        currentMapProprietaryJSON: null,
        currentMapProprietaryJSONOriginal: null,
        // mapCardIndexMarkedForDeletion: null, // Don't think we need these
        // mapCardMarkedForDeletion: null,
    });

    const navigate = useNavigate();
    const location = useLocation()
    const { auth } = useContext(AuthContext);
    const mapReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalMapActionType.DELETE_MAP: {
                return setMap({
                  ...map,
                  mapCardsInfo: map.mapCardsInfo.filter((mapCard) => mapCard._id !== payload.mapId),
                  currentMapMetadata: null,
                  currentMapGeoJSON: null,
                  currentMapGeoJSONOriginal: null,
                  currentMapProprietaryJSON: null,
                  currentMapProprietaryJSONOriginal: null
                })
              }
            
            case GlobalMapActionType.ERROR_MODAL: {
                return setMap({
                    ...map,
                    currentModal: CurrentModal.ERROR,
                    errorMessage: payload.errorMessage
                })
            }

            case GlobalMapActionType.FAVORITE_MAP: {
                const updatedMapCardsInfo = [...map.mapCardsInfo]
                updatedMapCardsInfo[payload.index].ownerFavorited = payload.ownerFavorited
                return setMap({
                    ...map,
                    mapCardsInfo: updatedMapCardsInfo
                })
            }
            
            case GlobalMapActionType.HIDE_MODALS: {
              return
            }

            case GlobalMapActionType.LOAD_MAP: {
                return setMap({
                    ...map,
                    currentMapGeoJSONOriginal: payload.originalGeoJSON,
                    currentMapGeoJSON: payload.currentGeoJSON,
                    currentMapMetadata: payload.mapMetadata
                })
            }

            case GlobalMapActionType.LOAD_MAP_CARDS: {
              return setMap({
                ...map,
                mapCardsInfo: payload.mapCards,
              })
            }

            case GlobalMapActionType.PUBLISH_MAP: {
                return setMap({
                  ...map,
                  mapCardsInfo: [
                    // should this be ...map
                    ...map.mapCardsInfo.map((mapCard) => {
                      if (mapCard._id === payload.mapId) {
                        return {
                          ...mapCard,
                          isPrivated: false,
                        };
                      }
                      return mapCard;
                    })
                  ]
                })
            }

            case GlobalMapActionType.RENAME_MAP: {

                if ( payload.index === -1 && map.currentMapMetadata) {
                    const updatedMapMetadata = {...map.currentMapMetadata}
                    updatedMapMetadata.title = payload.title
                    return setMap({
                        ...map,
                        currentMapMetadata: updatedMapMetadata
                    })
                }
                else {
                    const updatedMapCardsInfo = [...map.mapCardsInfo]
                    updatedMapCardsInfo[payload.index].title = payload.title
                    return setMap({
                        ...map,
                        mapCardsInfo: updatedMapCardsInfo
                    })
                }
            }

            case GlobalMapActionType.SAVE_MAP_EDITS: {
                return setMap({
                    ...map,
                    currentMapGeoJSONOriginal: map.currentMapGeoJSON,
                    currentMapGeoJSON: _.cloneDeep(map.currentMapGeoJSON),
                    currentMapProprietaryJSONOriginal: map.currentMapProprietaryJSON,
                    currentMapProprietaryJSON: _.cloneDeep(map.currentMapProprietaryJSON)
                })
            }

            case GlobalMapActionType.SET_CURRENT_MAP_METADATA: {
                // only occurs from fork and upload, so set the geoJSON to null too
                return setMap({
                    ...map,
                    currentMapMetadata: payload.mapMetadata,
                    currentMapGeoJSON: null,
                    currentMapGeoJSONOriginal: null,
                })

            }

            case GlobalMapActionType.UPDATE_MAP_PRIVACY: {
              const updatedMapCardsInfo = [...map.mapCardsInfo]
              updatedMapCardsInfo[payload.index].isPrivated = payload.isPrivated
              return setMap({
                ...map,
                mapCardsInfo: updatedMapCardsInfo
              })
            }
            case GlobalMapActionType.EXIT_CURRENT_MAP: {
                return setMap({
                    ...map, 
                    currentMapMetadata: null,
                    currentMapGeoJSON: null,
                    currentMapGeoJSONOriginal: null,
                    currentMapProprietaryJSON: null,
                    currentMapProprietaryJSONOriginal: null
                })
            }
            default:
              return map
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
              type: GlobalMapActionType.LOAD_MAP_CARDS,
              payload: { mapCards: response.data.mapMetadatas }
              })
          }
        } catch (error) {
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.loadMap = async (id) => {
        try {
        
            let response = await api.getMapMetadata(id)
            if (response.status !== 200) {
                console.log('not a 200 status code')
                return
            }
            const mapMetadata = response.data.mapMetadata
            if (response.status !== 200) {
                console.log('not a 200 status code')
                return
            }
            response = await api.getMapData(id)
            const {currentGeoJSON, originalGeoJSON} = await unzipBlobToJSON(response.data)
            mapReducer({
                type: GlobalMapActionType.LOAD_MAP,
                payload: {currentGeoJSON, originalGeoJSON, mapMetadata}
            })
        }
        catch (error) {
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
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
            return response
        }
        catch (error) { 
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
        return null;
    }

    map.renameMap = async (id, title, index) => {
        try {
            const response = await api.renameMap(id, title)
            if (response.status === 200) {
                mapReducer({
                    type: GlobalMapActionType.RENAME_MAP,
                    payload: {index, title, id}
                })
            }
        }
        catch (error) {
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.forkMap = async (id) => {
        try {
            const response = await api.forkMap(id)
            if (response.status === 200) {
                mapReducer({
                    type: GlobalMapActionType.SET_CURRENT_MAP_METADATA,
                    payload: {mapMetadata: response.data.mapMetadata}
                })

                navigate(`/editMap/${response.data.mapMetadata._id}`)
            }
        }
        catch (error) {
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
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
                else {
                    console.error("Export Map Error: no zipData created")
                }
            }
            catch (error) {
                mapReducer({
                    type: GlobalMapActionType.ERROR_MODAL,
                    payload: { hasError: true, errorMessage: error.response.data.errorMessage }
                })
                return
            }
        }
        try {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipData);
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
                    type: GlobalMapActionType.FAVORITE_MAP,
                    payload: { index, ownerFavorited: response.data.ownerFavorited }
                })
            }
        }
        catch (error) {
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.deleteMap = async (mapId) => {
      try {
        const response = await api.deleteMap(mapId)
        if (response.status === 200) {
          if (!location.pathname.endsWith('/mymaps')) {
            mapReducer({
                type: GlobalMapActionType.DELETE_MAP,
                payload: { mapId }
            })
            navigate(`/mymaps`)
          }
          else { // still on /myaps so just delete on client side
            mapReducer({
                type: GlobalMapActionType.DELETE_MAP,
                payload: { mapId }
              })
          }
        }
      } catch (error) {
        mapReducer({
            type: GlobalMapActionType.ERROR_MODAL,
            payload: { hasError: true, errorMessage: error.response.data.errorMessage }
        })
      }
    }
  
    map.updateMapPrivacy = async (mapId, index) => {
      try {
        const response = await api.updateMapPrivacy(mapId)
        if (response.status === 200) {
          mapReducer({
            type: GlobalMapActionType.UPDATE_MAP_PRIVACY,
            payload: {isPrivated: response.data.isPrivated, index}
          })
        }
      } catch (error) {
        mapReducer({
            type: GlobalMapActionType.ERROR_MODAL,
            payload: { hasError: true, errorMessage: error.response.data.errorMessage }
        })
      }
    }

    map.saveMapEdits = async (id) => {

        const delta1 = generateDiff(map.currentMapGeoJSONOriginal, map.currentMapGeoJSON)
        const delta2 = generateDiff(map.currentMapProprietaryJSONOriginal, map.currentMapProprietaryJSON)
        if (!delta1 && !delta2) {
            console.error("no deltas created. Was the map even edited to begin with?")
            return
        }

        try {
            const proprietaryJSON = delta2 ? map.currentMapProprietaryJSON : null
            const response = await api.saveMapEdits(id, delta1, proprietaryJSON)
            if (response.status === 200) {
                tps.clearAllTransactions()
                alert("Map edits saved successfully. Clearing TPS stack and setting original geoJSON to current geoJSON")
                mapReducer({
                    type: GlobalMapActionType.SAVE_MAP_EDITS, // in the reducer, update original geoJSON and original proprietary geoJSON
                    payload: {}
                })
            }

        }
        catch (error) {
            mapReducer({
                type: GlobalMapActionType.ERROR_MODAL,
                payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            })
        }
    }

    map.publishMap = async (mapId, title, textContent, tags) => {
      try {
        const response = await api.publishMap(mapId, {
          title,
          textContent,
          tags,
        })
        if (response.status === 200) {
          mapReducer({
            type: GlobalMapActionType.PUBLISH_MAP,
            payload: { mapId: mapId }
          })
          navigate(`/post/${response.data.postId}`)
        }
      } catch (error) {
        mapReducer({
            type: GlobalMapActionType.ERROR_MODAL,
            payload: { hasError: true, errorMessage: error.response.data.errorMessage }
        })
      }
    }

    map.exitCurrentMap = () => {
        mapReducer({
            type: GlobalMapActionType.EXIT_CURRENT_MAP,
            payload: {}
        })
    }

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
    return (
        <GlobalMapContext.Provider value={{map}}>
            {props.children}
        </GlobalMapContext.Provider>
    )
}

export default GlobalMapContext ;
export { GlobalMapContextProvider };