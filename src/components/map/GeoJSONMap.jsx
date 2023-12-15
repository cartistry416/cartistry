// eslint-disable-next-line
import GlobalMapContext from '../../contexts/map'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, Popup, useLeaflet} from 'react-leaflet'

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls } from 'react-leaflet-geoman-v2'

import * as ReactDOM from 'react-dom/client';

import EditFeaturePopup from './EditFeaturePopup';


function getNameFromConvertedShapeFile(properties) {

    let keyBase = "NAME_"

    for (let i=3; i>=0; i--) {
        const key = `${keyBase}${i}`
        if (key in properties){
            return properties[key]
        } 
    }
    return "MISSING_NAME"
}

// https://react-leaflet.js.org/docs/example-popup-marker/
// https://github.com/CodingWith-Adam/geoJson-map-with-react-leaflet/blob/master/src/components/MyMap.jsx
// https://github.com/alex3165/react-leaflet-draw/blob/7963cfee5ea7f0c85bd294251fa0e150c59641a7/examples/class/edit-control.js
// https://stackoverflow.com/questions/73353506/extracting-values-from-html-forms-rendered-in-react-leaflet-popup

function GeoJSONMap({mapMetadataId, position, editEnabled, width, height, setMapRef, mapRef}) {
    const { map } = useContext(GlobalMapContext)

    const editMapRef = useRef(null)
    // let mapContainerRef = useRef(null)


    const [selectedFeature, setSelectedFeature] = useState(null)
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {

    }, [mapRef])

    // useEffect(() => {

    //   console.log(mapContainerRef)
    //   if (selectedFeature && mapContainerRef.current.current) {
    //     // Create a container for the portal
    //     console.log('inside if')
    //     const container = document.createElement('div');
    //     setPopupContainer(container);
  
    //     const popup = L.popup().setLatLng(selectedFeature.geometry.coordinates);
    //     popup.setContent(container);
    //     popup.openOn(mapContainerRef.current.current.leafletElement); 
    //   }
    // }, [selectedFeature, mapContainerRef]);
  
    function handleDrawModeToggleLayer(e) {
      console.log(this.layer)

    }
    const onEachFeature = (feature, layer) => {
        const idx = map.currentMapGeoJSON.features.indexOf(feature)

        if (!feature.properties.name) {
          feature.properties.name = getNameFromConvertedShapeFile(feature.properties)
        }


        // layer.on('click', handleFeatureClick);
        layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
        layer.bindPopup(renderPopupForm(feature, idx, layer))

        // layer.on('pm:globaldrawmodetoggled', handleDrawModeToggleLayer.bind(layer))

    }


    const renderPopupForm = (feature, idx, layer) => {

      const popup = L.popup();
      const container = L.DomUtil.create('div');
      popup.setContent(container);
      const root = ReactDOM.createRoot(container);
      root.render(<EditFeaturePopup feature={feature} idx={idx} handlePopupSubmit={handlePopupSubmit} layer={layer}> </EditFeaturePopup>)
      return popup;
    }
    const handlePopupSubmit = (e, feature, idx, layer) => {

      try {
        const oldStyle = feature.properties.style

        const weight = parseInt(e.target[3].value)
        const opacity =  parseInt(e.target[4].value)
        const fillOpacity =  parseInt(e.target[5].value)

        if (weight > 100 || opacity > 100 || fillOpacity > 100) {
          alert("invalid input")
          return 
        }
        
        if (weight < 0 || opacity < 0 || fillOpacity < 0) {
          alert("invalid input")
          return 
        }

        const newStyle = {
          fillColor: e.target[1].value,
          color: e.target[2].value,
          weight,
          opacity,
          fillOpacity,
          name: e.target[0].value
        }
        map.addEditFeaturePropertiesTransaction(newStyle, oldStyle, idx)
      }
      catch (err) {
        alert("invalid input")
        return 
      }

      layer.unbindTooltip()
      layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });

    }


      const getFeatureStyle = (feature) => {

        if (!feature.properties.style) {
          feature.properties.style = {
            fillColor: 'transparent',
            color: 'blue',
            weight: 2,
            opacity: 1,
            fillOpacity: 100,
            name: feature.properties.name || ""
          }
        }
        return feature.properties.style
      }
    

      const handleChange = (e) => {
        console.log('Event fired!')
      }

      const toggleBindPopup = (enabled) => {
        if (!enabled) {
          Object.entries(mapRef._layers).forEach(([key, layer]) => {
            if (layer.prevPopup) {
              layer.bindPopup(layer.prevPopup)
              layer.prevPopup = null
            }
          })
        }
        else {
          Object.entries(mapRef._layers).forEach(([key, layer]) => {
            const popup = layer.getPopup()
            if (popup) {
              layer.prevPopup = popup
              layer.unbindPopup()
            }
          });
        }
      }

      const handleDrawModeToggle = (e) => {
        console.log(e)

        // console.log(mapRef._panes.overlayPane)
        toggleBindPopup(e.enabled)
      }

      const handleEditModeToggle = (e) => {
        console.log(e)
        toggleBindPopup(e.enabled)
      }

    return (
        <div className="mapContainerSize">
            <MapContainer ref={setMapRef} center={[51.505, -0.09]} zoom={3} style={{ width:`${width}`, height: `${height}`, zIndex: '1', borderRadius: '1rem'}} >
                {editEnabled ? 
                 <FeatureGroup>
                  <GeomanControls
                    options={{
                      position: 'topleft',
                      drawText: false,
                    }}
                    globalOptions={{
                      continueDrawing: true,
                      editable: false,
                    }}
                    onCreate={handleChange}
                    onChange={(e) => console.log('onChange', e)}
                    onGlobalDrawModeToggled={handleDrawModeToggle}
                    onGlobalEditModeToggled={handleEditModeToggle}
                  />
               </FeatureGroup> : null}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />
                {map.currentMapGeoJSON && (
                    <GeoJSON
                        data={map.currentMapGeoJSON}
                        style={feature => { return getFeatureStyle(feature) }}
                        onEachFeature={onEachFeature}
                    >
                    </GeoJSON> 
                )}
            </MapContainer>
        </div>
    )
}

export default GeoJSONMap
