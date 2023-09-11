import React, { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'

// https://github.com/CodingWith-Adam/geoJson-map-with-react-leaflet/blob/master/src/components/MyMap.jsx
function GeoJSONMap() {
    const [geoData, setGeoData] = useState(null)
    const [position, setPosition] = useState([39.74739, -105])
    const [key, setKey] = useState(0)

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const parsedGeoJSON = JSON.parse(e.target.result)
                    setGeoData(parsedGeoJSON)
                    // find a way to calculate the center
                    const newPosition = [40.74739, -50] 
                    setPosition(newPosition)
                    console.log(parsedGeoJSON)
                    // bandaid fix to force a re-render on map container, need to figure out issue
                    setKey(key + 1)
                } catch (error) {
                    console.error('Error parsing GeoJSON:', error)
                }
            }
            reader.readAsText(file)
        }
    }
    
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
          <h1>GeoJSON Map Viewer</h1>
          <input type="file" id="geojsonFile" accept=".json" onChange={handleFileUpload} />
          <MapContainer key={key} center={position} zoom={4} style={{ width: '600px', height: '400px' }}>
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
