
import {useState} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
import KMLMap from './components/KML';
import './App.css';

import MapFileParserFactory from './classes/mapFileParser.ts';

function App() {

  const [mapData, setMapData] = useState(null)
  const [fileExtension, setFileExtension] = useState("Nothing")

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
        console.log("done parsing map data")
        setMapData(data)
      })
    }
    setFileExtension(ext)
    setMapData(null)
    mapFileParser.readFile(file)
  }

  let map = null;
  
  if (fileExtension === "json") {
    const position = [40.74739, -50] 
    map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>
  }
  else if (fileExtension === "kml") {
    map = <KMLMap kmlData={mapData}> </KMLMap>
  }
  else if (fileExtension === "zip") {
    const position = [40.74739, -50] 
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
