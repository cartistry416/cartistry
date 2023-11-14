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
              <div className="toolbox-pan-controls">
                <span className="toolbox-pan-controls-label">Zoom</span>
                <input type="range" className="toolbox-pan-range" min="0" max="100" value="50" />
                <div className="toolbox-pan-controls-inner">
                  <div className="toolbox-pan-controls-buttons">
                    <span className="material-icons">remove</span>
                    <span className="material-icons">add</span>
                  </div>
                  <input type="number" className="toolbox-pan-zoom-value" value="50"/>
                </div>
              </div>
              <div className="toolbox-separator"></div>
              <div className="toolbox-bin-controls">
                <span className="toolbox-bin-label">Color</span>
                <input type="color" className="toolbox-bin-controls-colorInput" />
              </div>
              <div className="toolbox-separator"></div>
              <div className="toolbox-landmark-controls">
                <div className="toolbox-landmark-iconRows">
                 <span className="material-icons">apartment</span>
                 <span className="material-icons">restaurant</span>
                 <span className="material-icons">school</span>
                 <span className="material-icons">museum</span>
                 <span className="material-icons">store</span>
                 <span className="material-icons">home</span>
                 <span className="material-icons">church</span>
                </div>
              </div>
              <div className="toolbox-separator"></div>
              <div className="toolbox-gradient-controls">
                <div className="toolbox-gradient-controls-row">
                  <span className="toolbox-gradient-label">Color</span>
                  <input type="color" className="toolbox-gradient-controls-colorInput" />
                </div>
                <div className="toolbox-gradient-controls-row">
                  <span className="toolbox-gradient-label">Min</span>
                  <input type="number" className="toolbox-gradient-controls-numberInput" value="0"/>
                </div>
                <div className="toolbox-gradient-controls-row">
                  <span className="toolbox-gradient-label">Max</span>
                  <input type="number" className="toolbox-gradient-controls-numberInput" value="100"/>
                </div>
                <div className="toolbox-gradient-controls-row">
                  <span className="toolbox-gradient-label">Sections</span>
                  <input type="number" className="toolbox-gradient-controls-numberInput" value="4"/>
                </div>

              </div>

            </div>
            {/* <input type="text" placeholder="Label" className="textInput" />
            <input type="color" className="colorInput" /> */}
        </div>
        

      </div>
    );
  };
  
  export default Toolbox;