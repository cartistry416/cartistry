import "../../static/css/editMap.css";
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
                        <button className="undoButton">Undo</button>
                        <button className="redoButton">Redo</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditMapWrapper;