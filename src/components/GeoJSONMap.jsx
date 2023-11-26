// eslint-disable-next-line
import GlobalMapContext from '../contexts/map'
import React, { useEffect, useState, useContext } from 'react'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, Circle } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet';
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

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
function GeoJSONMap({mapMetadataId, position, editEnabled, width, height}) {
    const { map } = useContext(GlobalMapContext)
    const [currentGeoJSON, setCurrentGeoJSON] = useState(null);
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      const loadMapData = async () => {
          try {
              await map.loadMap(mapMetadataId);
              setLoaded(true);
          } catch (error) {
              console.error("Failed to load map: ", error);
          }
      };

      if (!loaded) {
          loadMapData();
      }
  }, [mapMetadataId, loaded]);

    const onEachFeature = (feature, layer) => {
        let name = null;
        if ('name' in feature.properties) {
            name = feature.properties.name
        }
        else {
            name = getNameFromConvertedShapeFile(feature.properties)
        }
        layer.bindTooltip(name, { permanent: true, direction: 'center' });
    }

    // const position = [39.74739, -105]
    const myCustomStyle = {
        fillColor: 'transparent',
        color: 'blue',
        weight: 2,
        opacity: 1,
        fillOpacity: 0,
    }


    // TODO: See what we can use from the example code snippet.

    // const _editableFG = null;
    
    // const _onFeatureGroupReady = (reactFGref) => {
    //   // populate the leaflet FeatureGroup with the geoJson layers
  
    //   let leafletGeoJSON = new L.GeoJSON(currentGeoJSON); 
    //   let leafletFG = reactFGref;
  
    //   leafletGeoJSON.eachLayer((layer) => {
    //     leafletFG.addLayer(layer);
    //   });
  
    //   // store the ref for future access to content
  
    //   this._editableFG = reactFGref;
    // };
  
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

        console.log(layer)
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


    return (
        <div className="mapContainerSize">
          {loaded ? (
            <>
            <MapContainer center={position} zoom={4} style={{ width:`${width}`, height: `${height}`, zIndex: '1', borderRadius: '1rem'}}>
                {editEnabled ? 
                <FeatureGroup 
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
                        <Circle center={[51.51, -0.06]} radius={200} />
                </FeatureGroup> : null}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />
                {map.currentMapGeoJSON && (
                    <GeoJSON
                        data={map.currentMapGeoJSON}
                        style={myCustomStyle}
                        onEachFeature={onEachFeature}
                    /> 
                )}
            </MapContainer>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
    )
}

export default GeoJSONMap
