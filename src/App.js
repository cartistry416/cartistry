// eslint-disable-next-line
import {useState, useEffect} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
import LoginModal from './components/modals/LoginModal.jsx';
import RegisterModal from './components/modals/RegisterModal.jsx'
import './App.css';
// eslint-disable-next-line
import api from './store/store-request-api'
// import MapFileParserFactory from './classes/mapFileParser.ts';
// eslint-disable-next-line
import JSZip from 'jszip';
import { AuthContextProvider } from './auth';
// eslint-disable-next-line
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeWrapper from './components/HomeWrapper/HomeWrapper'
import NavBar from './components/NavBar';
import './static/css/global.css'
import './static/css/fonts.css'
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import ErrorModal from './components/modals/ErrorModal';
import EditMapWrapper from './components/EditMapWrapper/EditMapWrapper.jsx';
import PostScreen from './components/Posts/PostScreen.jsx';
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />


function App() {
  
  // eslint-disable-next-line
  const [mapData, setMapData] = useState(null)
  // eslint-disable-next-line
  const [fileExtension, setFileExtension] = useState(null)
  const [dummyData, setDummyData] = useState(null)


  let map = null
  const position = [0,0]
  map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>

  const handleDummyOnClick = () => {
    // api.getDummyData().then((res) => {
    //   setDummyData(res.data)
    // })
    setDummyData('dummyData')
  }

  const dummyRequest = () => {
    // api.getDummyData().then((res) => {
    //   setDummyData(res.data)
    // })
    api.getMostRecentPosts(10).then(res => {
      setDummyData(res.data.posts)
    })
  }
  let dummyNode = <div> </div>
  if (dummyData) {
    dummyNode = <div id="dummyText">{JSON.stringify(dummyData)}</div>
  }


  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) {
      console.error("No file uploaded?")
      return 
    }

    const ext = file.name.split('.').pop().toLowerCase()

    let blob = file;
    const formData = new FormData()
    if (ext === "json" || ext === "kml") {

      const zip = new JSZip()
      zip.file(file.name, file)

      blob = await zip.generateAsync({type: 'blob'})
    }
    else if (ext !== "zip") {
      console.error("Unsupported file extension: " + ext)
      return
    }

    formData.append('zipFile', blob )
    formData.append('fileExtension', ext)
    formData.append('title', "testMap")
    formData.append('templateType', "heat")
    // eslint-disable-next-line
    const res = await api.uploadMap(formData)
  }

  return (
    <BrowserRouter>
      <AuthContextProvider>
      <div className="App">
            {/* <h1> Map Viewer</h1>
              <button id="dummy" onClick={handleDummyOnClick}> dummy </button>
              {dummyNode}
              <RegisterModal></RegisterModal>
              <LoginModal> </LoginModal>
              <button onClick={dummyRequest}>Get Most Recent Posts</button>
              <input type="file" id="geojsonFile" accept="*" onChange={handleFileUpload} />
              {map} */}
            <NavBar/>
            <Routes>
                        <Route path="/home/" element={<HomeWrapper/>} />
                        <Route path="/editMap/" element={<EditMapWrapper/>} />
                        <Route path="/post/" element={<PostScreen/>} />
                        {/* <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} /> */}
            </Routes>
            <LoginModal/>
            <RegisterModal/>
            <ForgotPasswordModal/>
            <ErrorModal/>
      </div>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
