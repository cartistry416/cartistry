
import {useState, useEffect} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
// import KMLMap from './components/KML';
import './App.css';

import MapFileParserFactory from './classes/mapFileParser.ts';
import JSZip from 'jszip';
import api from './store/store-request-api'

function App() {
  // const [turfLoaded, setTurfLoaded] = useState(false);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'turf.min.js'; // Relative path to the script
  //   script.async = true;
  //   script.onload = () => {
  //     console.log(window.turf)
  //     setTurfLoaded(true);
  //   };
  //   document.head.appendChild(script);

  //   return () => {
  //     // Clean up if needed
  //     document.head.removeChild(script);
  //   };
  // }, []);
  
  const [mapData, setMapData] = useState(null)
  const [fileExtension, setFileExtension] = useState(null)
  const [dummyData, setDummyData] = useState(null)

  /*
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
  */


  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) {
      console.error("No file uploaded?")
      return 
    }

    const ext = file.name.split('.').pop().toLowerCase()

    const formData = new FormData()
    if (ext === ".json" || ext === ".kml") {

      const zip = new JSZip()
      zip.file(file.name, file)

      zip.generateAsync({type: 'blob'}).then(blob => {
        formData.append('zipFile', blob)
        formData.append('json', JSON.stringify({fileExtension: ext}))
        api.uploadMap(formData)
      })

    }
    else if (ext === ".zip") {
      formData.append('zipFile', file)
      formData.append('json', JSON.stringify({fileExtension: ext}))
      api.uploadMap(formData)
    }
    else {
      console.error("Unsupported file extension: " + ext)
      return
    }
  }

  let map = null
  const position = [0,0]
  map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>

  const handleDummyOnClick = () => {
    api.getDummyData().then((res) => {
      setDummyData(res.data)
    })
  }
  let dummyNode = <div> </div>
  if (dummyData) {
    dummyNode = <div> {JSON.stringify(dummyData)} </div>
  }

  return (
    <div className="App">
          <h1> Map Viewer</h1>
          <input type="file" id="geojsonFile" accept="*" onChange={handleFileUpload} />
          <p> Only upload the following types: .json, .kml, or .zip containing relevant shapefile(s) </p>
          <p> Note: shapefiles take a bit longer to load, so please wait a moment! </p>
          <button onClick={handleDummyOnClick}> dummy </button>
          {dummyNode}

          {map}
    </div>
  );
}

export default App;
