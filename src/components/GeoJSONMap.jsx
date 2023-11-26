// eslint-disable-next-line
import GlobalMapContext from '../contexts/map'
import React, { useEffect, useState, useContext } from 'react'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, Circle } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
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
function GeoJSONMap({mapMetadataId, position, width, height}) {
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

    return (
        <div className="mapContainerSize">
          {loaded ? (
            <>
            <MapContainer center={position} zoom={4} style={{ width:`${width}`, height: `${height}`, zIndex: '1', borderRadius: '1rem'}}>
                <FeatureGroup>
                        <EditControl
                        position='topleft'
                        onEdited={() => {}}
                        onCreated={() => {console.log("hi")}}
                        onDeleted={() => {}}
                        draw={{
                            rectangle: false, // if we use this library, we can easily disable which drawing tools are available
                        }}
                        />
                        <Circle center={[51.51, -0.06]} radius={200} />
                </FeatureGroup>
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
