// eslint-disable-next-line
import GlobalMapContext from '../../contexts/map'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, Popup, useLeaflet, } from 'react-leaflet'

import Geoman  from './Geoman';

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
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

function GeoJSONMap({mapMetadataId, position, editEnabled, width, height, setMapRef, mapRef, currentMarkerIcon}) {
    const { map } = useContext(GlobalMapContext)

    const featureGroupRef = useRef(null)

    // const [geoManActive, setGeoManActive] = useState(false)
    // const geoManActiveRef = useRef(geoManActive);

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
        layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
        layer.bindPopup(renderPopupForm(feature, idx, layer))
        // layer.pm.disable()
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
            name: feature.properties.name || "",
            pmIgnore: true
          }
        }
        return feature.properties.style
      }
    


      const toggleBindPopup = (enabled, mapRef) => {
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

      const handleLayerCreate = (e) => {
        console.log(e)
      }

      const handleLayerUpdate = (e) => {
        console.log(e)
      }

      const handleLayerCut = (e) => {
        console.log(e)
      }

      const handleLayerRemove = (e) => {
        console.log(e)
      }


      const handleLayerRotate = (e) => {
        console.log(e)
      }

    const handleEditModeToggle = (e) => {
      console.log(e)
      toggleBindPopup(e.enabled)
    }
    
    const createIcon = (iconName) => {
      return L.divIcon({
        className: 'custom-icon',
        html: `<span class="material-icons">${iconName}</span>`,
        iconSize: L.point(50, 50),
      });
    };

  const icons = {
    'default': createIcon('location_on'),
    'apartment': createIcon('apartment'),
    'restaurant': createIcon('restaurant'),
    'school': createIcon('school'),
    'museum': createIcon('museum'),
    'store': createIcon('store'),
    'home': createIcon('home'),
    'church': createIcon('church'),
    // Add more icons as needed
  };

  const currentLIcon = icons[currentMarkerIcon] || icons['default'];


    return (
        <div className="mapContainerSize">
            <MapContainer ref={setMapRef} center={[51.505, -0.09]} zoom={3} style={{ width:`${width}`, height: `${height}`, zIndex: '1', borderRadius: '1rem'}} >
                {editEnabled ? 
                  <Geoman toggleBindPopup={toggleBindPopup} handleLayerCreate={handleLayerCreate} handleLayerUpdate={handleLayerUpdate} 
                  handleLayerCut={handleLayerCut} handleLayerRemove={handleLayerRemove} handleLayerRotate={handleLayerRotate} /> : null
                }

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />
                {map.currentMapGeoJSON && (
                    <GeoJSON
                        data={map.currentMapGeoJSON}
                        style={feature => { return getFeatureStyle(feature) }}
                        onEachFeature={onEachFeature}
                        pmIgnore={true}
                    >
                    </GeoJSON> 
                )}
            </MapContainer>
        </div>
    )
}

export default GeoJSONMap
