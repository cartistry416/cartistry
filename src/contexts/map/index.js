import { createContext, useContext, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './map-request-api'
import AuthContext from '../../auth'
import jsTPS from '../../common/jsTPS'
import { generateDiff, unzipBlobToJSON, jsonToZip, deepCopyLayer} from '../../utils/utils'
import _, { after, before, findIndex, update } from 'lodash'
import EditFeature_Transaction from '../../transactions/EditFeature_Transaction'
import CreateLayer_Transaction from '../../transactions/CreateLayer_Transaction'
import RemoveLayer_Transaction from '../../transactions/RemoveLayer_Transaction'
import * as L from "leaflet";
import UpdateLayerLatLngs_Transaction from '../../transactions/UpdateLayerLatLngs_Transaction'
import CreateGradientPoint_Transaction from '../../transactions/CreateGradientPoint_Transaction'

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
    EXIT_CURRENT_MAP: "EXIT_CURRENT_MAP",
    SORT_MAP_CARDS: "SORT_MAP_CARDS",
    SET_COLOR_SELECTED: "SET_COLOR_SELECTED",
    EDIT_FEATURE_PROPERTY: "EDIT_FEATURE_PROPERTY",
    SET_MARKER_ACTIVE: "SET_MARKER_ACTIVE",
    SET_HEAT_COLORS: "SET_HEAT_COLORS",
    DELETE_HEAT_COLORS: "DELETE_HEAT_COLORS", //TODO: make this edit instead of delete
    SET_HEAT_NUM_SECTIONS: "SET_HEAT_NUM_SECTIONS",
    SET_HEAT_PROPERTIES_AND_SELECTED: "SET_HEAT_PROPERTIES_AND_SELECTED",
    EDIT_HEAT_VALUE_PROPERTIES: "EDIT_HEAT_VALUE_PROPERTIES",
    EDIT_HEAT_VALUE_SELECTED: "EDIT_HEAT_VALUE_SELECTED",
    SET_GRADIENT_OPTIONS: "SET_GRADIENT_OPTIONS",
    RECALCULATE_GRADIENT: "RECALCULATE_GRADIENT", 
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
        originalLayersGeoJSON: null,
        colorSelected: "#3388ff",
        markerActive: false,
        heatColors: ["#ffffff", "#e08300", "#e90101"],
        numHeatSections: 10,
        heatValueProperties: [],
        heatValueSelectedProperty: null,
        gradientOptions: {
            options: {
                radius: 25,
                blur: 15,
                max: 100,
                gradient: {
                    33: '#ffffff',
                    67: '#e08300',
                    100: '#e90101',
                }
            },
            intensity: 50
        }, 
        gradientLayers: null,

        // mapCardIndexMarkedForDeletion: null, // Don't think we need these
        // mapCardMarkedForDeletion: null,
    });

    const navigate = useNavigate();
    const location = useLocation()
    const { auth } = useContext(AuthContext);

    const gradientLayersRef = useRef([])

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
                  currentMapProprietaryJSONOriginal: null,
                  originalLayersGeoJSON: null,
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

                let heatColors = []
                if (payload.gradientOptions && payload.gradientOptions.options.gradient) {
                    console.log(payload.gradientOptions)
                    Object.entries(payload.gradientOptions.options.gradient).forEach(([k,v]) => {
                        heatColors.push(v)
                    })
                }
                else {
                    heatColors = ["#ffffff", "#e08300", "#e90101"]
                }

                return setMap({
                    ...map,
                    currentMapGeoJSONOriginal: payload.originalGeoJSON,
                    currentMapGeoJSON: payload.currentGeoJSON,
                    currentMapMetadata: payload.mapMetadata,
                    currentMapProprietaryJSONOriginal: payload.currentMapProprietaryJSONOriginal,
                    currentMapProprietaryJSON: payload.currentMapProprietaryJSON,
                    originalLayersGeoJSON: payload.originalLayersGeoJSON,
                    gradientLayers: payload.gradientLayers,
                    gradientOptions: payload.gradientOptions,
                    heatColors
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
                    currentMapProprietaryJSON: _.cloneDeep(map.currentMapProprietaryJSON),
                    originalLayersGeoJSON: payload.layersGeoJSON
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
                gradientLayersRef.current = []
                return setMap({
                    ...map, 
                    currentMapMetadata: null,
                    currentMapGeoJSON: null,
                    currentMapGeoJSONOriginal: null,
                    currentMapProprietaryJSON: null,
                    currentMapProprietaryJSONOriginal: null,
                    colorSelected: '#3388ff',
                    heatColors: ["#ffffff", "#e08300", "#e90101"],
                    numHeatSections: 10,
                    markerActive: false
                })
            }
            case GlobalMapActionType.SORT_MAP_CARDS: {
                const updatedMapCardsInfo = [...map.mapCardsInfo]
                // console.log(payload.sortType)
                // console.log(updatedMapCardsInfo)

                if (payload.sortType === "name") {
                    updatedMapCardsInfo.sort((a, b) => {
                        return a.title.localeCompare(b.title)
                    })
                }
                else if (payload.sortType === "edit") {
                    updatedMapCardsInfo.sort((a, b) => {
                        const date1 = new Date(a.updatedAt)
                        const date2 = new Date(b.updatedAt)
                        return date2 - date1
                    })
                }
                else if (payload.sortType === "create") {
                    updatedMapCardsInfo.sort((a, b) => {
                        const date1 = new Date(a.createdAt)
                        const date2 = new Date(b.createdAt)
                        return date2 - date1
                    })
                }
                // console.log(updatedMapCardsInfo)
                return setMap({
                    ...map,
                    mapCardsInfo: updatedMapCardsInfo
                })
            }
            case GlobalMapActionType.SET_COLOR_SELECTED: {
                return setMap({
                    ...map,
                    colorSelected: payload.color,
                })
            }
            case GlobalMapActionType.SET_MARKER_ACTIVE: {
                return setMap({
                    ...map,
                    markerActive: payload.active
                })
            }
            case GlobalMapActionType.SET_HEAT_COLORS: {
                const updatedHeatColors = map.heatColors.slice(0, payload.numColors);
                updatedHeatColors[payload.index] = payload.color;

                const updatedGradient = {}
                const len = updatedHeatColors.length
                updatedHeatColors.forEach((color, index) => {
                    const upper = Math.round(((1 / len) * (index + 1)) * 100)
                    updatedGradient[upper] = color
                })
               
                return setMap({
                    ...map,
                    heatColors: updatedHeatColors,
                    gradientOptions: {
                        ...map.gradientOptions,
                        options: {
                            ...map.gradientOptions.options,
                            gradient: updatedGradient
                        }
                    }
                })
            }
            case GlobalMapActionType.DELETE_HEAT_COLORS: {
                return setMap({
                    ...map,
                    heatColors: map.heatColors.slice(0, payload.newNumHeatColors)
                })
            }
            case GlobalMapActionType.SET_HEAT_NUM_SECTIONS: {
                return setMap({
                    ...map,
                    numHeatSections: payload.numHeatSections
                })
            }
            case GlobalMapActionType.EDIT_HEAT_VALUE_PROPERTIES: {
                return setMap({
                    ...map,
                    heatValueProperties: payload.heatValueProperties
                })
            }
            case GlobalMapActionType.EDIT_HEAT_VALUE_SELECTED: {
                return setMap({
                    ...map,
                    heatValueSelectedProperty: payload.heatValueSelectedProperty
                })
            }
            case GlobalMapActionType.SET_HEAT_PROPERTIES_AND_SELECTED: {
                return setMap({
                    ...map,
                    heatValueProperties: payload.heatValueProperties,
                    heatValueSelectedProperty: payload.heatValueSelectedProperty
                })
            }
            case GlobalMapActionType.EDIT_FEATURE_PROPERTY: {
                const updatedGeoJSON = map.currentMapGeoJSON
                if (updatedGeoJSON.features[payload.index].properties.name !== payload.newStyle.name) {
                    updatedGeoJSON.features[payload.index].properties.name = payload.newStyle.name
                }  
                updatedGeoJSON.features[payload.index].properties.style = payload.newStyle
                return setMap({
                    ...map,
                    currentMapGeoJSON: updatedGeoJSON
                })
            }
            case GlobalMapActionType.SET_GRADIENT_OPTIONS: {
                const radius = payload.radius ? payload.radius : map.gradientOptions.options.radius
                const blur = payload.blur? payload.blur : map.gradientOptions.options.blur
                const intensity = payload.intensity? payload.intensity: map.gradientOptions.intensity
                const gradient = payload.gradient ? payload.gradient: map.gradientOptions.options.gradient
                return setMap({
                    ...map,
                    gradientOptions: {
                        options: {
                            radius,
                            blur,
                            gradient
                        },
                        intensity
                    }
                })
            }
            case GlobalMapActionType.RECALCULATE_GRADIENT: {
                const updatedGradient = {}
                const len = map.heatColors.length
                map.heatColors.forEach((color, index) => {
                    const upper = Math.round(((1 / len) * (index + 1)) * 100)
                    updatedGradient[upper] = color
                })
               
                return setMap({
                    ...map,
                    gradientOptions: {
                        ...map.gradientOptions,
                        options: {
                            ...map.gradientOptions.options,
                            gradient: updatedGradient
                        }
                    }
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
            const responseBodyString = new TextDecoder('utf-8').decode(response.data);
            const parts = responseBodyString.split(`\r\n--boundary--`)[0].split('--boundary');


            const obj = JSON.parse(parts[1].split('\r\n\r\n')[1])
            const gradientLayers = obj.gradientLayers
            const gradientOptions = obj.gradientOptions
            console.log(obj)

            const currentMapProprietaryJSON = JSON.parse(parts[1].split('\r\n\r\n')[1]).proprietaryJSON
            const currentMapProprietaryJSONOriginal = JSON.parse(parts[1].split('\r\n\r\n')[1]).proprietaryJSON

            const currentGeoJSON = JSON.parse(parts[2].split('\r\n\r\n')[1])
            const originalGeoJSON = JSON.parse(parts[2].split('\r\n\r\n')[1])

            let originalLayersGeoJSON = null
            try {
                originalLayersGeoJSON = JSON.parse(parts[3].split('\r\n\r\n')[1])
                //console.log(originalLayersGeoJSON)
            }
            catch (err) {
                console.log('no layers sent, probably not initialized')
            }

            mapReducer({
                type: GlobalMapActionType.LOAD_MAP,
                payload: {currentGeoJSON, originalGeoJSON, mapMetadata,currentMapProprietaryJSON, 
                    currentMapProprietaryJSONOriginal, originalLayersGeoJSON, gradientLayers, gradientOptions}
            })
        }
        catch (error) {
            console.error(error)
            // mapReducer({
            //     type: GlobalMapActionType.ERROR_MODAL,
            //     payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            // })
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

    map.saveMapEdits = async (id, thumbnail, featureGroupRef) => {

        if (!featureGroupRef.current) {
            console.error("no feature group for geoman")
            return
        }

        let layersGeoJSON = []
        const layers = featureGroupRef.current.getLayers() //featureGroupRef.current.pm.getLayers()
        if (layers.length > 0) {
            layersGeoJSON = layers.map(layer => {
                const gj = layer.toGeoJSON()
                if (layer instanceof L.Circle) {
                    // console.log('circle: ', layer)
                    gj.properties.options = {...layer.options, pmIgnore: false}
                    gj.properties.layerType = 'circle'
                    // gj.geomtery.coordinates [lng, lat]
                }
                else if (layer instanceof L.CircleMarker) {
                    // console.log('circle marker: ', layer)
                    gj.properties.layerType = 'circleMarker'
                    gj.properties.options =  {...layer.options, pmIgnore: false}
                }
                else if (layer instanceof L.Polygon) {
                    // console.log('polygon : ', layer) 
                    gj.properties.layerType = 'polygon'
                    gj.properties.options =  {...layer.options, pmIgnore: false}

                }
                else if (layer instanceof L.Polyline) {
                    // console.log('polyline : ', layer)
                    gj.properties.layerType = 'polyline'
                    gj.properties.options =  {...layer.options, pmIgnore: false}
                }
                else if (layer instanceof L.Marker) {
                    // console.log('marker ', layer)
                    gj.properties.layerType = 'marker'
                    gj.properties.options =  {...layer.options.icon.options, pmIgnore: false}
                }
                else if (layer instanceof L.FeatureGroup) {
                    console.log('feature group')

                }
                else {
                    console.log('none of the L. whatever')
                }
                return gj
            })
        }

        // console.log('layers sent: ',layersGeoJSON)
        let gradientLayersGeoJSON = []
        if (gradientLayersRef.current && gradientLayersRef.current.length > 0) {
            gradientLayersGeoJSON = gradientLayersRef.current.map(layer => {
                const pointFeature = {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [layer[0], layer[1]], // Replace with your desired coordinates
                    },
                    properties: {
                      templateType: 'gradient',
                      intensity: layer[2]
                    },
                  };
                  return pointFeature
            })
        }

        const delta1 = generateDiff(map.currentMapGeoJSONOriginal, map.currentMapGeoJSON)
        const delta2 = generateDiff(map.currentMapProprietaryJSONOriginal, map.currentMapProprietaryJSON)
        const delta3 = generateDiff(map.originalLayersGeoJSON, layersGeoJSON)

        // if (!delta1 && !delta2 && !delta3) {
        //     alert('no deltas, no edits')
        //     return
        // }

        try {
            const proprietaryJSON = delta2 ? map.currentMapProprietaryJSON : null

            // console.log("Size of geoJSON: " + JSON.stringify(map.currentMapGeoJSON).length) 
            // console.log("Size of delta: " + JSON.stringify(delta1).length) 
            // console.log("size of layers: " + JSON.stringify(layersGeoJSON).length)

            console.log(map.gradientOptions)

            const response = await api.saveMapEdits(id, delta1, proprietaryJSON, thumbnail, layersGeoJSON, gradientLayersGeoJSON, map.gradientOptions)
            if (response.status === 200) {
                tps.clearAllTransactions()
                alert("Map edits saved successfully. Clearing TPS stack and setting original geoJSON to current geoJSON")
                mapReducer({
                    type: GlobalMapActionType.SAVE_MAP_EDITS, // in the reducer, update original geoJSON and original proprietary geoJSON
                    payload: {layersGeoJSON}
                })
            }

        }
        catch (error) {
            console.error(error)
            // mapReducer({
            //     type: GlobalMapActionType.ERROR_MODAL,
            //     payload: { hasError: true, errorMessage: error.response.data.errorMessage }
            // })
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

    map.sortBy = (type) => {
        mapReducer({
            type: GlobalMapActionType.SORT_MAP_CARDS,
            payload: {sortType: type}
        })
    }

    map.addEditFeaturePropertiesTransaction = (newStyle, oldStyle, index) => { 
        const transaction = new EditFeature_Transaction(map, index, oldStyle, newStyle)
        tps.addTransaction(transaction, true)
    }

    map.editFeatureProperties = (newStyle, index) => {

        mapReducer({
            type: GlobalMapActionType.EDIT_FEATURE_PROPERTY,
            payload: {newStyle, index}
        })
    }

    map.addCreateLayerTransaction = (layer, featureGroupRef) => {
        const layerGeoJSON = layer.toGeoJSON()
        const options = {
            pmIgnore: false,
            style: function (feature) {
              return {...layer.options};
            },
            pointToLayer: (feature, latlng) => {
              return L.marker(latlng, { icon: layer.options.icon || new L.Icon.Default() });
            }
          };

        // featureGroupRef.current.removeLayer(layer)
        // const layerClone =  L.geoJSON(layerGeoJSON, options)
        // featureGroupRef.current.addLayer(layerClone)

        const transaction = new CreateLayer_Transaction(map, layer, featureGroupRef)
        tps.addTransaction(transaction, false)
    } 

    map.createLayerDo = (layer, featureGroupRef) => {
        if (!featureGroupRef.current) {
            return
        }
        featureGroupRef.current.addLayer(layer)
    }

    map.createLayerUndo = (layer, featureGroupRef) => {
        if (!featureGroupRef.current) {
            return
        }
        featureGroupRef.current.removeLayer(layer)
    }

    map.addDeleteLayerTransaction = (layer, featureGroupRef) => {
        const transaction = new RemoveLayer_Transaction(map, layer, featureGroupRef)
        tps.addTransaction(transaction, false)
    }

    map.deleteLayerDo = (layer, featureGroupRef) => {
        if (!featureGroupRef.current) {
            return
        }
        featureGroupRef.current.removeLayer(layer)
    }

    map.deleteLayerUndo = (layer, featureGroupRef) => {
        if (!featureGroupRef.current) {
            return
        }
        featureGroupRef.current.addLayer(layer)
    }



    // map.addCutLayerTransaction = (beforeLayer, afterLayer, featureGroupRef, mapRef) => {

    //     // const beforeLayerGeoJSON = beforeLayer.toGeoJSON()
    //     // const options1 = {pmIgnore: false, style: function (feature) {
    //     //     return beforeLayer.options;
    //     // }}
    //     // const beforeLayerClone = L.geoJSON(beforeLayerGeoJSON, options1)

    //     // featureGroupRef.current.removeLayer(afterLayer)

    //     // const afterLayerGeoJSON = afterLayer.toGeoJSON()
    //     // const options2 = {pmIgnore: false, style: function (feature) {
    //     //     return afterLayer.options;
    //     // }}
    //     // const afterLayerClone = L.geoJSON(afterLayerGeoJSON, options2)

    //     // featureGroupRef.current.addLayer(afterLayerClone)
    //     const transaction = new CutLayer_Transaction(map, beforeLayer, afterLayer, featureGroupRef, mapRef)
    //     tps.addTransaction(transaction, false)
    // }

    // map.cutLayerDo = (beforeLayer, afterLayer, featureGroupRef, mapRef) => {
    //     featureGroupRef.current.removeLayer(beforeLayer)

    //     // afterLayer.options.pmIgnore = false
    //     // L.PM.reInitLayer(afterLayer)
    //     // console.log(afterLayer)
    //     // afterLayer.pm.enable()
    //     featureGroupRef.current.addLayer(afterLayer)
    //     afterLayer.pm.enable()
    //     // if(!mapRef.pm.globalEditModeEnabled()) {
    //     //     // console.log('here2')
    //     //     // mapRef.pm.toggleGlobalEditMode()
    //     // }

    // }
    // map.cutLayerUndo = (beforeLayer, afterLayer, featureGroupRef, mapRef) => {
    //     featureGroupRef.current.removeLayer(afterLayer)
    //     // console.log(beforeLayer)
    //     featureGroupRef.current.addLayer(beforeLayer)
    //     beforeLayer.pm.enable() 
    //     // beforeLayer.pm.setOptions({
    //     //     allowEditing: false
    //     // })
    //     // beforeLayer.pm.setOptions({
    //     //     allowEditing: true
    //     // })
    //     // if(!mapRef.pm.globalEditModeEnabled()) {
    //     //     // console.log('here1')
    //     //     mapRef.pm.toggleGlobalEditMode()
    //     //     mapRef.pm.toggleGlobalEditMode()
    //     //     // const button = document.querySelector('.leaflet-pm-action.action-finishMode')
    //     //     // console.log(button)
    //     //     // button.click()
    //     // }
    //     // beforeLayer.options.pmIgnore = false
    //     // L.PM.reInitLayer(beforeLayer)
    // }

    map.addUpdateLayerLatLngsTransaction = (layer, featureGroupRef, oldLatLngs, newLatLngs) => {
        const transaction = new UpdateLayerLatLngs_Transaction(map, layer, featureGroupRef, oldLatLngs, newLatLngs)
        tps.addTransaction(transaction, false)

        //console.log(featureGroupRef.current.getLayers())
    }

    map.updateLayerLatLngs = (layer, featureGroupRef, newLatLngs) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.CircleMarker) {
            layer.setLatLng(newLatLngs)
        } 
        else {
            layer.setLatLngs(newLatLngs)
        }

        // console.log(featureGroupRef.current.getLayers())

    }

    map.setColorSelected = (color) => {
        mapReducer({
            type: GlobalMapActionType.SET_COLOR_SELECTED,
            payload: {color}
        })
    }

    map.setMarkerActive = (active) => {
        mapReducer({
            type: GlobalMapActionType.SET_MARKER_ACTIVE,
            payload: {active}
        })
    }

    map.setHeatColors = (index, color, numColors) => {
        mapReducer({
            type: GlobalMapActionType.SET_HEAT_COLORS,
            payload: {index, color, numColors}
        })
    }
    map.deleteHeatColors = (newNumHeatColors) => {
        mapReducer({
            type: GlobalMapActionType.DELETE_HEAT_COLORS,
            payload: { newNumHeatColors }
        });
    }
    map.setHeatNumSections = (numHeatSections) => {
        mapReducer({
            type: GlobalMapActionType.SET_HEAT_NUM_SECTIONS,
            payload: {numHeatSections}
        })
    }
    map.editHeatValueProperties = (heatValueProperties) => {
        mapReducer({
            type: GlobalMapActionType.EDIT_HEAT_VALUE_PROPERTIES,
            payload: {heatValueProperties}
        })
    }
    map.editHeatValueSelectedProperty = (heatValueSelectedProperty) => {
        mapReducer({
            type: GlobalMapActionType.EDIT_HEAT_VALUE_SELECTED,
            payload: {heatValueSelectedProperty}
        })
    }
    map.setHeatPropertiesAndSelected = (heatValueSelectedProperty, heatValueProperties) => {
        mapReducer({
            type: GlobalMapActionType.SET_HEAT_PROPERTIES_AND_SELECTED,
            payload: {heatValueSelectedProperty, heatValueProperties}
        })
    }

    map.setGradientRadius = (radius) => {
        mapReducer({
            type: GlobalMapActionType.SET_GRADIENT_OPTIONS,
            payload: {radius}
        })

    }

    map.setGradientBlur = (blur) => {
        mapReducer({
            type: GlobalMapActionType.SET_GRADIENT_OPTIONS,
            payload: {blur}
        })
    }

    map.setGradientIntensity = (intensity) => {
        mapReducer({
            type: GlobalMapActionType.SET_GRADIENT_OPTIONS,
            payload: {intensity}
        })
    }
    
    map.recalculateGradient = () => {
        mapReducer({
            type: GlobalMapActionType.RECALCULATE_GRADIENT,
            payload: {}
        })
    }

    map.addCreateGradientPointTransaction = (lat, lng, addDataPointToHeatmap, popDataFromHeatMap) => {
        const transaction = new CreateGradientPoint_Transaction(lat, lng, addDataPointToHeatmap, popDataFromHeatMap)
        tps.addTransaction(transaction, true)
    }

    map.loadGradientLayers = (setHeatmapData) => {
        map.gradientLayers.forEach(feature => {
            gradientLayersRef.current.push([feature.geometry.coordinates[0], 
                feature.geometry.coordinates[1], feature.properties.intensity])
        })
        setHeatmapData([...gradientLayersRef.current])
    }
 
    map.canUndo = function() {
        return ((map.currentMapGeoJSONOriginal !== null) && tps.hasTransactionToUndo())
    }
    map.canRedo = function() {
        return ((map.currentMapGeoJSONOriginal !== null) && tps.hasTransactionToRedo())
    }


    map.undo = () => {
        tps.undoTransaction()
    }
    map.redo = () => {
        tps.doTransaction(true)
    }

    return (
        <GlobalMapContext.Provider value={{map, gradientLayersRef}}>
            {props.children}
        </GlobalMapContext.Provider>
    )
}

export default GlobalMapContext ;
export { GlobalMapContextProvider };