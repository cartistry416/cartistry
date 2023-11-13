const Toolbox = () => {
    return (
      <div className="toolbox">
        <div className="toolbox-header">
          <h2 className="map-title">Map Title</h2>
          <button className="menu-button">☰</button>
        </div>
        <div className="toolbox-body">
            <button className="toolButton pan">Pan</button>
            <button className="toolButton fill">Fill</button>
            <button className="toolButton point">Point</button>

            
            <button className="toolButton gradient">Gradient</button>
            <button className="toolButton line">Line</button>
            <button className="toolButton polygon">Polygon</button>
            
            <button className="toolButton landmark">Landmark</button>
            <input type="text" placeholder="Label" className="textInput" />
            <input type="color" className="colorInput" />
        </div>
        

      </div>
    );
  };
  
  export default Toolbox;