// eslint-disable-next-line
import GlobalMapContext from '../contexts/map'
import React, { useEffect, useState, useContext } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
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
function GeoJSONMap({mapMetadataId, position}) {
    const { map } = useContext(GlobalMapContext)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        map.loadMap(mapMetadataId).then(() => {
            setLoaded(true)
        })
    },[])
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
        <div>
            {
                !loaded && <div> Map is loading... </div>
            }
          <MapContainer center={position} zoom={4} style={{ width: '600px', height: '400px' }}>
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
        </div>
    )
}

export default GeoJSONMap
