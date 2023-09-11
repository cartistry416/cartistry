import React, { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'

// https://react-leaflet.js.org/docs/example-popup-marker/
// https://github.com/CodingWith-Adam/geoJson-map-with-react-leaflet/blob/master/src/components/MyMap.jsx
function GeoJSONMap(props) {
    //const [geoData, setGeoData] = useState(null)
    const {geoData, position} = props
    
    const onEachFeature = (feature, layer) => {
        layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
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
          <MapContainer center={position} zoom={4} style={{ width: '600px', height: '400px' }}>
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
              />
              {geoData && (
                  <GeoJSON
                      data={geoData}
                      style={myCustomStyle}
                      onEachFeature={onEachFeature}
                  /> 
              )}
          </MapContainer>
        </div>
    )
}

export default GeoJSONMap
