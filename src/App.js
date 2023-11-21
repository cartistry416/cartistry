//dummy commit
// eslint-disable-next-line
import {useState, useEffect} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
import './App.css';
// import MapFileParserFactory from './classes/mapFileParser.ts';
// eslint-disable-next-line
import JSZip from 'jszip';
import { AuthContextProvider } from './auth';
import { GlobalMapContextProvider } from './contexts/map';
// eslint-disable-next-line
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeWrapper from './components/HomeWrapper/HomeWrapper'
import NavBar from './components/NavBar';
import './static/css/global.css'
import './static/css/fonts.css'
import AlertModal from './components/modals/AlertModal';
import EditMapWrapper from './components/EditMapWrapper/EditMapWrapper.jsx';
import PostScreen from './components/Posts/PostScreen.jsx';
import MyMapsWrapper from './components/MyMapsWrapper';
import PostEditor from './components/Posts/PostEditor.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import MyPostsScreen from './components/MyPostsScreen.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import RegisterScreen from './components/RegisterScreen.jsx';
import ForgotPasswordScreen from './components/ForgotPasswordScreen.jsx';
import ResetPasswordScreen from './components/ResetPasswordScreen.jsx';
import RequestPasswordScreen from './components/requestPasswordScreen.jsx';
import '../src/static/css/modals.css'
import '../src/static/css/authScreens.css'
import { GlobalPostContextProvider } from './contexts/post/index.js';
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
  }

  // eslint-disable-next-line
  let dummyNode = <div> </div>
  if (dummyData) {
    dummyNode = <div id="dummyText">{JSON.stringify(dummyData)}</div>
  }


  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalMapContextProvider>
          <GlobalPostContextProvider>
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
                              <Route path="/" element={<LoginScreen/>} />
                              <Route path="/register/" element={<RegisterScreen/>} />
                              <Route path="/forgotPassword/" element={<ForgotPasswordScreen/>}/>
                              <Route path="/resetPassword/" element={<ResetPasswordScreen/>}/>
                              <Route path="/requestPassword/" element={<RequestPasswordScreen/>}/>
                              <Route path="/home/" element={<HomeWrapper/>} />
                              <Route path="/editMap/:id/:index/:title" element={<EditMapWrapper/>} />
                              <Route path="/post/:id" element={<PostScreen/>} />
                              <Route path="/myMaps/" element={<MyMapsWrapper/>}/>
                              <Route path="/myPosts/" element={<MyPostsScreen/>}/>
                              <Route path="/editPost/:mapMetadataId?" element={<PostEditor/>} />
                              <Route path="/profile/" element={<ProfileScreen/>} />
                              {/* <Route path="/login/" exact component={LoginScreen} />
                              <Route path="/register/" exact component={RegisterScreen} />
                              <Route path="/playlist/:id" exact component={WorkspaceScreen} /> */}
                  </Routes>
            </div>
          </GlobalPostContextProvider>
        </GlobalMapContextProvider>
        
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
