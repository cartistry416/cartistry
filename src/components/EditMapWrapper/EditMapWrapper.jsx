import "../../static/css/editMap/editMap.css";
// eslint-disable-next-line
import MapContainer from './MapContainer';
import Toolbox from './Toolbox';
import Legend from './Legend';
import GeoJSONMap from "../GeoJSONMap";

const EditMapWrapper = () =>{
    return (
        <div className="editMapWrapper">
            <div className="mapScreen">
                <GeoJSONMap position={[39.74739, -105]}/>
                <div className="rightPanel">
                    <Toolbox />
                    <Legend />
                    <div className="sideControls">
                    <div className="iconGroup">
                        <span className="material-icons">undo</span>
                        <span className="material-icons">redo</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditMapWrapper;