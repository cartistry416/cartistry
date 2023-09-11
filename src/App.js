
import {useState} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
import KMLMap from './components/KML';
import './App.css';
//import ShapefileMap from './components/ShapefileMap';
// import * as shp from 'shpjs';
// const xml2js = require('xml2js');
import toGeoJSON from 'togeojson';

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
        else if (ext === 'shp') {
              const shapefileContent = e.target.result;
              // console.log(arrayBuffer)
              // const readShapeFile = async (arrayBuffer) => {
              //   await shp(arrayBuffer)
              // }
              // readShapeFile(arrayBuffer).then(geoJSON => {
              //   setMapData(geoJSON)
              //   setFileExtension(ext)
              // })
              const shapefileDom = new DOMParser().parseFromString(shapefileContent, 'text/xml')
              const geojson = toGeoJSON.kml(shapefileDom)
              console.log(geojson)
              setMapData(geojson)
        }
      }
        
      reader.readAsText(file)

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
  else if (fileExtension === "shp") {
    console.log("rendering shp")
    const position = [40.74739, -50] 
    map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>
  }

  return (
    <div className="App">
          <h1> Map Viewer</h1>
          <input type="file" id="geojsonFile" accept=".json .kml .shp .geo" onChange={handleFileUpload} />
          {map}
    </div>
  );
}

export default App;
