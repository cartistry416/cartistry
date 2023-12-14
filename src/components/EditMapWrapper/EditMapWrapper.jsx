import "../../static/css/editMap/editMap.css";
// eslint-disable-next-line
import MapContainer from './MapContainer';
import Toolbox from './Toolbox';
import Legend from './Legend';
import GeoJSONMap from "../GeoJSONMap";

import { matchPath, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import GlobalPostContext from "../../contexts/post";
import GlobalMapContext from "../../contexts/map";




//https://stackoverflow.com/questions/66704970/take-a-screenshot-of-leaflet-map
const EditMapWrapper = () =>{
    const {id} = useParams()
    const {post} = useContext(GlobalPostContext)
    const {map} = useContext(GlobalMapContext)
    const [mapRef, setMapRef] = useState(null)


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
                <GeoJSONMap className="mapOverlay" position={[39.74739, -105]} setMapRef={setMapRef} mapMetadataId={id} editEnabled={true} width="100vw" height="100vh"/>
                <div className="rightPanel">
                    <Toolbox mapId={id} mapRef={mapRef} />
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
export default EditMapWrapper;