
import {useState} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
import KMLMap from './components/KML';
import './App.css';
import shp from 'shpjs';

function App() {

  const [mapData, setMapData] = useState(null)
  const [fileExtension, setFileExtension] = useState("")

  const handleFileUpload = (event) => {
    const file = event.target.files[0]

    if (file) {

      const ext = file.name.split('.').pop().toLowerCase()
      const reader = new FileReader()
      console.log(ext)
      reader.onload = (e) => {
        console.log("reader loaded file ", ext)
        if (ext === 'json') {
          console.log('attempt to parse GeoJSON')
          try {
            const parsedGeoJSON = JSON.parse(e.target.result)
            console.log(parsedGeoJSON)
            setMapData(parsedGeoJSON)
            // find a way to calculate the center
            // bandaid fix to force a re-render on map container, need to figure out issue
            setFileExtension(ext)
            console.log("parsed GeoJSON ")
          } 
          catch (error) {
              console.error('Error parsing GeoJSON:', error)
          }
        }
        else if (ext === 'kml') {
          const xmlParser = new DOMParser()
          const xml = xmlParser.parseFromString(e.target.result, 'text/xml')
          console.log('xml parsed')
          // const xml = e.target.result
          setMapData(xml)
          setFileExtension(ext)
        }
        else if (ext === 'zip') {
              const arrayBuffer = e.target.result;
              console.log(arrayBuffer)
              const readShapeFile = async (arrayBuffer) => {
                return await shp.parseZip(arrayBuffer)
              }
              readShapeFile(arrayBuffer).then(geoJSON => {
                console.log(geoJSON)
                setMapData(geoJSON)
                setFileExtension(ext)
              })
        }
      }
      
      if(ext === "zip") {
        reader.readAsArrayBuffer(file)
      }
      else if (ext === "json" || ext === "kml") {
        reader.readAsText(file)
      }
      else {
        alert("Invalid file type. Only upload the following types: .json, .kml, or .zip containing relevant shapefile(s)")
      }
    }
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
    console.log("rendering shp")
    const position = [40.74739, -50] 
    map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>
  }

  return (
    <div className="App">
          <h1> Map Viewer</h1>
          <input type="file" id="geojsonFile" accept="*" onChange={handleFileUpload} />
          {map}
    </div>
  );
}

export default App;
