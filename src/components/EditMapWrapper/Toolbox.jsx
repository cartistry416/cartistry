import { useState } from "react";
import "../../static/css/editMap/toolBox.css";
const Toolbox = () => {
  const [showOptions, setShowOptions] = useState(false)
    return (
      <div className="toolbox">
        <div className="toolbox-header">
          <h2 className="toolbox-title">Map Title</h2>
          <span className="material-icons" onClick={() => setShowOptions(!showOptions)}>more_vert</span>
          {showOptions && (
            <div className="dropdown">
              <div className="dropdown-list">
                <div className="dropdown-option">
                  <span className="material-icons option-icon">ios_share</span>
                  <span>Export</span>
                </div>
                <div className="dropdown-option">
                  <span className="material-icons option-icon">publish</span>
                  <span>Publish</span>
                </div>
                <div className="dropdown-option">
                  <span className="material-icons option-icon">fork_right</span>
                  <span>Fork</span>
                </div>
                <div className="dropdown-option">
                  <span className="material-icons option-icon">edit</span>
                  <span>Rename</span>
                </div>
                <div className="dropdown-option">
                  <span className="material-icons option-icon">delete</span>
                  <span>Delete</span>
                </div>
                <div className="dropdown-option">
                  <span className="material-icons option-icon">save</span>
                  <span>Save</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="toolbox-body">
            <div className="toolbox-iconRows">
              <span className="material-icons">pan_tool</span>
              <span className="material-icons">format_color_fill</span>
              <span className="material-icons">pin_drop</span>
              <span className="material-icons">gradient</span>
              <span className="material-icons">start</span>
              <span className="material-icons">polyline</span>
            </div>
            <div className="toolbox-separator"></div>
            <div className="toolbox-controls">

              
            </div>
            {/* <input type="text" placeholder="Label" className="textInput" />
            <input type="color" className="colorInput" /> */}
        </div>
        

      </div>
    );
  };
  
  export default Toolbox;