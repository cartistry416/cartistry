//dummy commit
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
import AlertModal from './components/modals/AlertModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';
import ConfirmPublishModal from './components/modals/ConfirmPublishModal';
import EditMapWrapper from './components/EditMapWrapper/EditMapWrapper.jsx';
import PostScreen from './components/Posts/PostScreen.jsx';
import ResetPassWordWrapper from './components/ResetPasswordWrapper';
import ResetPasswordModal from './components/modals/ResetPasswordModal';
import MyMapsWrapper from './components/MyMapsWrapper';
import PostEditor from './components/Posts/PostEditor.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import MyPostsScreen from './components/MyPostsScreen.jsx';
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />


function App() {
  
  // eslint-disable-next-line
  const [mapData, setMapData] = useState(null)
  // eslint-disable-next-line
  const [fileExtension, setFileExtension] = useState(null)
  const [dummyData, setDummyData] = useState(null)


  let map = null
  const position = [0,0]
  // eslint-disable-next-line
  map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>

  // eslint-disable-next-line
  const handleDummyOnClick = () => {
    // api.getDummyData().then((res) => {
    //   setDummyData(res.data)
    // })
    setDummyData('dummyData')
  }

  // eslint-disable-next-line
  const dummyRequest = () => {
    // api.getDummyData().then((res) => {
    //   setDummyData(res.data)
    // })
    api.getMostRecentPosts(10).then(res => {
      setDummyData(res.data.posts)
    })
  }

  // eslint-disable-next-line
  let dummyNode = <div> </div>
  if (dummyData) {
    dummyNode = <div id="dummyText">{JSON.stringify(dummyData)}</div>
  }

// eslint-disable-next-line
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
                        <Route path="/" element={<HomeWrapper/>} />
                        <Route path="/editMap/" element={<EditMapWrapper/>} />
                        <Route path="/post/" element={<PostScreen/>} />
                        <Route path="/resetPassword/" element={<ResetPassWordWrapper/>}/>
                        <Route path="/myMaps/" element={<MyMapsWrapper/>}/>
                        <Route path="/myPosts/" element={<MyPostsScreen/>}/>
                        <Route path="/editPost/" element={<PostEditor/>} />
                        <Route path="/profile/" element={<ProfileScreen/>} />
                        {/* <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} /> */}
            </Routes>
            <LoginModal/>
            <RegisterModal/>
            <ForgotPasswordModal/>
            <ResetPasswordModal/>
            <AlertModal/>
            <ConfirmPublishModal/>
            <ConfirmDeleteModal/>
      </div>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
