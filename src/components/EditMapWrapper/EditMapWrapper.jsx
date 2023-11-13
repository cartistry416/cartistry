import "../../static/css/editMap/editMap.css";
import MapContainer from './MapContainer';
import Toolbox from './Toolbox';
import Legend from './Legend';
const EditMapWrapper = () =>{
    return (
        <div className="editMapWrapper">
            <div className="mapScreen">
                <MapContainer />
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