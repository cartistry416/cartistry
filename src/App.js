
import {useState} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
// import KMLMap from './components/KML';
import './App.css';

import MapFileParserFactory from './classes/mapFileParser.ts';

function App() {

  const [mapData, setMapData] = useState(null)
  const [fileExtension, setFileExtension] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]

    if (!file) {
      console.error("No file uploaded?")
      return 
    }
    const ext = file.name.split('.').pop().toLowerCase()
    const reader = new FileReader()

    const mapFileParser = MapFileParserFactory(ext, reader)
    if (!mapFileParser) {
      alert("Invalid file type. Only upload the following types: .json, .kml, or .zip containing relevant shapefile(s)")
      return
    }

    reader.onload = (e) => {
      mapFileParser.parse(e.target.result).then(data => {
        // console.log(data)
        setMapData(data)
      })
    }
    setFileExtension(ext)
    setMapData(null)
    mapFileParser.readFile(file)
  }

  let map = null
  if (fileExtension) {
    const position = [0,0]
    map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>
  }

  return (
    <div className="App">
          <h1> Map Viewer</h1>
          <input type="file" id="geojsonFile" accept="*" onChange={handleFileUpload} />
          <p> Only upload the following types: .json, .kml, or .zip containing relevant shapefile(s) </p>
          <p> Note: shapefiles take a bit longer to load, so please wait a moment! </p>
          {map}
    </div>
  );
}

export default App;
