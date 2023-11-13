import MapContainer from './MapContainer';
import Toolbox from './Toolbox';
import Legend from './Legend';
function EditMapWrapper() {
    return (
        <div className="editMapWrapper">
            <div className="mapScreen">
                <MapContainer />
                <div className="sideControls">
                <button className="undoButton">Undo</button>
                <button className="redoButton">Redo</button>
                <Legend />
                </div>
            </div>
            <Toolbox />
        </div>
    );
}
export default EditMapWrapper;