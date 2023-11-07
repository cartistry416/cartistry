
import {useState, useEffect} from 'react'
import GeoJSONMap from './components/GeoJSONMap';
import LoginModal from './components/LoginModal.jsx';
import './App.css';
import api from './store/store-request-api'
import MapFileParserFactory from './classes/mapFileParser.ts';
import JSZip from 'jszip';
import { AuthContextProvider } from './auth';
import { BrowserRouter, Route, Switch } from 'react-router-dom'


function App() {
  
  const [mapData, setMapData] = useState(null)
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
  let dummyNode = <div> </div>
  if (dummyData) {
    dummyNode = <div id="dummyText">{dummyData}</div>
  }

  return (
    <BrowserRouter>
      <AuthContextProvider>
      <div className="App">
            <h1> Map Viewer</h1>
              <button id="dummy" onClick={handleDummyOnClick}> dummy </button>
              {dummyNode}
              <LoginModal> </LoginModal>

              {map}

            {/* <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
            </Switch> */}
      </div>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
