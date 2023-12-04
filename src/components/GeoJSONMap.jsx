// eslint-disable-next-line
import GlobalMapContext from '../contexts/map'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, Popup, useMap} from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet';
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
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

function GeoJSONMap({mapMetadataId, position, editEnabled, width, height}) {
    const { map } = useContext(GlobalMapContext)

    const editMapRef = useRef(null)
    let mapContainerRef = useRef(null)

    const [selectedFeature, setSelectedFeature] = useState(null)
    const [refresh, setRefresh] = useState(0)

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
  
    const onEachFeature = (feature, layer) => {
        const idx = map.currentMapGeoJSON.features.indexOf(feature)

        if (!feature.properties.name) {
          feature.properties.name = getNameFromConvertedShapeFile(feature.properties)
        }


        // layer.on('click', handleFeatureClick);
        layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
        layer.bindPopup(renderPopupForm(feature, idx, layer))

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
      const oldStyle = feature.properties.style
      const newStyle = {
        fillColor: e.target[1].value,
        color: e.target[2].value,
        weight: e.target[3].value,
        opacity: parseInt(e.target[4].value),
        fillOpacity: parseInt(e.target[5].value),
        name: e.target[0].value
      }
      map.addEditFeaturePropertiesTransaction(newStyle, oldStyle, idx)
      layer.unbindTooltip()
      layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
      
    }

    const handlePropertyChange = (propertyName, newValue) => {
      setSelectedFeature((prevSelectedFeature) => ({
        ...prevSelectedFeature,
        [propertyName]: newValue,
      }));
    };

    

    // const position = [39.74739, -105]
  
    const _onChange = () => {
    
        //const { onChange } = this.props;
        // const onChange = true;
    
        // if (_editableFG || !onChange) {
        //   return;
        // }
        // console.log(_editableFG);
        // const geojsonData = this._editableFG.toGeoJSON();
        // console.log(geojsonData)
        //onChange(geojsonData);
      };
    const _onEdited = (e) => {
        let numEdited = 0;
        e.layers.eachLayer((layer) => {
          numEdited += 1;
        });
        console.log(`_onEdited: edited ${numEdited} layers`, e);
    
        _onChange();
      };
    
      const _onCreated = (e) => {
        let type = e.layerType;
        let layer = e.layer;
        if (type === 'marker') {
          // Do marker specific actions
          console.log('_onCreated: marker created', e);
        } else {
          console.log('_onCreated: something else created:', type, e);
        }

        console.log(editMapRef.current._layers)
        console.log('------')
        // console.log(mapRef.current)

        // Do whatever else you need to. (save to db; etc)
    
        _onChange();
      };
    
      const _onDeleted = (e) => {
        let numDeleted = 0;
        e.layers.eachLayer((layer) => {
          numDeleted += 1;
        });
        console.log(`onDeleted: removed ${numDeleted} layers`, e);
    
        _onChange();
      };
    
      const _onMounted = (drawControl) => {
        console.log('_onMounted', drawControl);
      };
    
      const _onEditStart = (e) => {
        console.log('_onEditStart', e);
      };
    
      const _onEditStop = (e) => {
        console.log('_onEditStop', e);
      };
    
      const _onDeleteStart = (e) => {
        console.log('_onDeleteStart', e);
      };
    
      const _onDeleteStop = (e) => {
        console.log('_onDeleteStop', e);
      };


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
    
    return (
        <div className="mapContainerSize">
            <MapContainer ref={mapContainerRef} center={position} zoom={4} style={{ width:`${width}`, height: `${height}`, zIndex: '1', borderRadius: '1rem'}} >
                {editEnabled ? 
                <FeatureGroup ref={editMapRef}
                    // ref={(reactFGref) => {
                    // _onFeatureGroupReady(reactFGref)}}
                >
                        <EditControl
                        position='topleft'
                        onEdited={_onEdited}
                        onCreated={_onCreated}
                        onDeleted={_onDeleted}
                        onMounted={_onMounted}
                        onEditStart={_onEditStart}
                        onEditStop={_onEditStop}
                        onDeleteStart={_onDeleteStart}
                        onDeleteStop={_onDeleteStop}
                        draw={{
                            rectangle: false, // if we use this library, we can easily disable which drawing tools are available
                        }}
                        />

                        {/* <Circle center={[51.51, -0.06]} radius={200} /> */}
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
