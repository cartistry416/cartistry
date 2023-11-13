const Toolbox = () => {
    return (
      <div className="toolbox">
        <div className="toolbox-header">
          <h2 className="map-title">Map Title</h2>
          <span className="material-icons">more_vert</span>
        </div>
        <div className="toolbox-body">
            <span className="material-icons">pan_tool</span>
            <span className="material-icons">format_color_fill</span>
            <span className="material-icons">pin_drop</span>
            <span className="material-icons">gradient</span>
            <span className="material-icons">start</span>
            <span className="material-icons">polyline</span>
            
            {/* <input type="text" placeholder="Label" className="textInput" />
            <input type="color" className="colorInput" /> */}
        </div>
        

      </div>
    );
  };
  
  export default Toolbox;