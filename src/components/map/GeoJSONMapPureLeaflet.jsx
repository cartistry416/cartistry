
// this file is equivalent to GeoJSONMap.jsx but uses pure Leaflet instead of react-leaflet

import { useContext, useEffect, useRef} from 'react';
import GlobalMapContext from '../../contexts/map';
import * as ReactDOM from 'react-dom/client';
import EditFeaturePopup from './EditFeaturePopup';

import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

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


const GeoJSONMapPureLeaflet = ({editEnabled, width, height}) => {
    const {map} = useContext(GlobalMapContext)

    const mapRef = useRef(null)

    const getFeatureStyle = (feature) => {

        if (!feature.properties.style) {
          feature.properties.style = {
            fillColor: 'transparent',
            color: 'blue',
            weight: 2,
            opacity: 1,
            fillOpacity: 100,
            name: feature.properties.name || "",
          }
        }
        return feature.properties.style
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
            name: e.target[0].value,
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
  
    const renderPopupForm = (feature, idx, layer) => {

        const popup = L.popup();
        const container = L.DomUtil.create('div');
        popup.setContent(container);
        const root = ReactDOM.createRoot(container);
        root.render(<EditFeaturePopup feature={feature} idx={idx} handlePopupSubmit={handlePopupSubmit} layer={layer}> </EditFeaturePopup>)
        return popup;
      }
    
    const handleLayerCreate = (e) => {
        console.log(e)
        e.layer.options.pmIgnore = false;
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
    useEffect(() => {
        const mapContainer = L.map('map').setView([51.505, -0.09], 3)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(mapContainer)

        if (!map.currentMapGeoJSON) {
            return
        }

        L.geoJSON(map.currentMapGeoJSON, {
            pmIgnore: true,
            onEachFeature: function (feature, layer) {
                const idx = map.currentMapGeoJSON.features.indexOf(feature)

                if (!feature.properties.name) {
                  feature.properties.name = getNameFromConvertedShapeFile(feature.properties)
                }
                layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
                layer.bindPopup(renderPopupForm(feature, idx, layer))
            },
            style: function (feature) {
                return getFeatureStyle(feature)
            },
          }).addTo(mapContainer);

        mapRef.current = mapContainer;

        if (!editEnabled) {
            return
        }

        mapContainer.pm.addControls({
            position: 'topleft',
        })

        mapContainer.on('pm:globaleditmodetoggled', e => toggleBindPopup(e.enabled, mapRef.current))
        mapContainer.on('pm:globaldrawmodetoggled', e => toggleBindPopup(e.enabled, mapRef.current))
        mapContainer.on('pm:globalcutmodetoggled', e => toggleBindPopup(e.enabled, mapRef.current))
        mapContainer.on('pm:globalremovalmodetoggled', e => toggleBindPopup(e.enabled, mapRef.current))
        mapContainer.on('pm:globalrotatemodetoggled', e => toggleBindPopup(e.enabled, mapRef.current))
        mapContainer.on('pm:create', handleLayerCreate)
        mapContainer.on('pm:update', handleLayerUpdate)
        mapContainer.on('pm:remove', handleLayerRemove)
        mapContainer.on('pm:cut', handleLayerCut)
        mapContainer.on('pm:rotate', handleLayerRotate)

    }, [])
    


    return (
        <div className="mapContainerSize" id={"map"}></div>
    )

}

export default GeoJSONMapPureLeaflet