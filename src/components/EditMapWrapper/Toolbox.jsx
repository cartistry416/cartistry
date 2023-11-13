const Toolbox = () => {
    return (
      <div className="toolbox">
        <button className="toolButton pan">Pan</button>
        <button className="toolButton fill">Fill</button>
        <button className="toolButton point">Point</button>

        
        <button className="toolButton gradient">Gradient</button>
        <button className="toolButton line">Line</button>
        <button className="toolButton polygon">Polygon</button>
        
        <input type="text" placeholder="Label" className="textInput" />
        <input type="color" className="colorInput" />

        <button className="toolButton landmark">Landmark</button>
        {/* ... other tools */}
      </div>
    );
  };
  
  export default Toolbox;