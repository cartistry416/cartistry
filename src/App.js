// eslint-disable-next-line
import {useState, useEffect} from 'react'
import GeoJSONMap from './components/map/GeoJSONMap';
import './App.css';
// import MapFileParserFactory from './classes/mapFileParser.ts';
// eslint-disable-next-line
import JSZip from 'jszip';
import { AuthContextProvider } from './auth';
import { GlobalMapContextProvider } from './contexts/map';
// eslint-disable-next-line
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from './components/NavBar';
import './static/css/global.css'
import './static/css/fonts.css'
import HomeScreen from './screens/HomeScreen.jsx'
import EditMapScreen from './screens/EditMapScreen.jsx';
import PostScreen from './screens/PostScreen.jsx';
import MyMapsScreen from './screens/MyMapsScreen.jsx';
import EditPostScreen from './screens/EditPostScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import MyPostsScreen from './screens/MyPostsScreen.jsx';
import LoginScreen from './screens/auth/LoginScreen.jsx';
import RegisterScreen from './screens/auth/RegisterScreen.jsx';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen.jsx';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen.jsx';
import RequestPasswordScreen from './screens/auth/requestPasswordScreen.jsx';
import '../src/static/css/modals.css'
import '../src/static/css/authScreens.css'
import { GlobalPostContextProvider } from './contexts/post/index.js';
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />


function App() {
  
  // eslint-disable-next-line
  const [mapData, setMapData] = useState(null)
  // eslint-disable-next-line
  const [fileExtension, setFileExtension] = useState(null)
  let map = null
  const position = [0,0]
  // eslint-disable-next-line
  map = <GeoJSONMap geoData={mapData} position={position}> </GeoJSONMap>

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalMapContextProvider>
          <GlobalPostContextProvider>
            <div className="App">
                  <NavBar/>
                  <Routes>
                    <Route path="/" element={<LoginScreen/>} />
                    <Route path="/register/" element={<RegisterScreen/>} />
                    <Route path="/forgotPassword/" element={<ForgotPasswordScreen/>}/>
                    <Route path="/resetPassword/" element={<ResetPasswordScreen/>}/>
                    <Route path="/requestPassword/" element={<RequestPasswordScreen/>}/>
                    <Route path="/home/" element={<HomeScreen/>} />
                    <Route path="/editMap/:id" element={<EditMapScreen/>} />
                    <Route path="/post/:id" element={<PostScreen/>} />
                    <Route path="/myMaps/" element={<MyMapsScreen/>}/>
                    <Route path="/myPosts/" element={<MyPostsScreen/>}/>
                    <Route path="/editPost/:id?" element={<EditPostScreen/>} />
                    <Route path="/profile/:username/:id" element={<ProfileScreen/>} />
                  </Routes>
            </div>
          </GlobalPostContextProvider>
        </GlobalMapContextProvider>
        
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
