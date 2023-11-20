import "../../static/css/editMap/editMap.css";
// eslint-disable-next-line
import MapContainer from './MapContainer';
import Toolbox from './Toolbox';
import Legend from './Legend';
import GeoJSONMap from "../GeoJSONMap";

import { useParams } from "react-router";
import { useContext, useEffect } from "react";
import GlobalMapContext from "../../contexts/map";

const EditMapWrapper = () => {
    const {id} = useParams()

    return (
        <div className="editMapWrapper">
            <div className="mapScreen">
                <GeoJSONMap position={[39.74739, -105]} mapMetadataId={id} />
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