import "../static/css/editMap/editMap.css";
import Toolbox from '../components/map/Toolbox';
import GeoJSONMap from "../components/map/GeoJSONMap";

import { useParams } from "react-router";
import { useContext, useEffect, useState, useRef } from "react";
import GlobalPostContext from "../contexts/post";
import GlobalMapContext from "../contexts/map";
// import GeoJSONMapPureLeaflet from "../components/map/GeoJSONMapPureLeaflet";




//https://stackoverflow.com/questions/66704970/take-a-screenshot-of-leaflet-map
const EditMapScreen = () =>{
    const {id} = useParams()
    const {post} = useContext(GlobalPostContext)
    const {map} = useContext(GlobalMapContext)
    const [mapRef, setMapRef] = useState(null)

    // const [featureGroupRef, setFeatureGroupRef] = useState(null)
    const featureGroupRef = useRef(null)

    useEffect(() => {
        post.exitCurrentPost()
      }, [])


    const handleUndo = (e) => {
        e.preventDefault()
        if (!map.canUndo()) {
            console.log("cant undo")
            return 
        }
        map.undo()
    }

    const handleRedo = (e) => {
        e.preventDefault()
        if (!map.canRedo()) {
            console.log("cant redo")
            return 
        }
        map.redo()

    }
    return (
        <div className="editMapWrapper">
            <div className="mapScreen">
                {/* <GeoJSONMapPureLeaflet  className="mapOverlay" position={[39.74739, -105]} setMapRef={setMapRef} mapRef={mapRef} mapMetadataId={id} editEnabled={true} width="100vw" height="100vh"/>  */}
                <GeoJSONMap className="mapOverlay" position={[39.74739, -105]} setMapRef={setMapRef} mapRef={mapRef} mapMetadataId={id} 
                editEnabled={true}
                featureGroupRef={featureGroupRef}
                width="100vw" height="94vh"
                />
                <div className="rightPanel">
                    <Toolbox mapId={id} mapRef={mapRef} featureGroupRef={featureGroupRef}/>
                    {/* <Legend /> */}
                    <div className="sideControls">
                    <div className="iconGroup">
                        <span className="material-icons" onClick={handleUndo} >undo</span>
                        <span className="material-icons" onClick={handleRedo} >redo</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditMapScreen;