import "../../static/css/editMap/legend.css";
//TODO: will need to redo this, legend is hardcoded for now
const Legend = () => {
    return (
      <div className="legend">
        <div className="legend-header">
          <h2 className="legend-title">Legend</h2>
        </div>
        <div className="legend-body">
          <div className="legend-temp-title">bin</div>
          <div className="legend-bin">
            <table class="legend-bin-table">
              <tr>
                <th>Color</th>
                <th>Label</th>
                <th></th>
              </tr>
              <tr>
                <td><div class="legend-bin-color"></div></td>
                <td><input type="text" className="legend-bin-color-label" value="label one"/></td>
                <td><span className="material-icons">delete</span></td>
              </tr>
              <tr>
                <td><div class="legend-bin-color2"></div></td>
                <td><input type="text" className="legend-bin-color-label" value="label two"/></td>
                <td><span className="material-icons">delete</span></td>
              </tr>
            </table>
          </div>
          <div className="legend-separator"></div>
          <div className="legend-temp-title">landmark</div>
          <div className="legend-landmark">
            <table class="legend-landmark-table">
              <tr>
                <th>Landmark</th>
                <th>Label</th>
                <th></th>
              </tr>
              <tr>
                <td><span className="material-icons">apartment</span></td>
                <td><input type="text" className="legend-landmark-label" value="apartment"/></td>
                <td><span className="material-icons">delete</span></td>
              </tr>
              <tr>
                <td><span className="material-icons">school</span></td>
                <td><input type="text" className="legend-landmark-label" value="school"/></td>
                <td><span className="material-icons">delete</span></td>
              </tr>
            </table>
          </div>
          <div className="legend-separator"></div>
          <div className="legend-temp-title">gradient</div>
          <div className="legend-gradient">
            <table class="legend-gradient-table">
              <tr>
                <th>Color</th>
                <th>Section</th>
              </tr>
              <tr>
                <td><div class="legend-gradient1-color"></div></td>
                <td><input type="text" className="legend-gradient-label" value="75-100" readonly="readonly"/></td>
              </tr>
              <tr>
                <td><div class="legend-gradient2-color"></div></td>
                <td><input type="text" className="legend-gradient-label" value="50-75" readonly="readonly"/></td>
              </tr>
              <tr>
                <td><div class="legend-gradient3-color"></div></td>
                <td><input type="text" className="legend-gradient-label" value="25-50" readonly="readonly"/></td>
              </tr>
              <tr>
                <td><div class="legend-gradient4-color"></div></td>
                <td><input type="text" className="legend-gradient-label" value="0-25" readonly="readonly"/></td>
              </tr>
            </table>
          </div>
          <div className="legend-separator"></div>
          <div className="legend-temp-title">lines</div>
          <div className="legend-lines">
            <table class="legend-cadastral-table">
              <tr>
                <th>Color</th>
                <th>Label</th>
                <th></th>
              </tr>
              <tr>
                <td><div class="legend-bin-color2"></div></td>
                <td><input type="text" className="legend-lines-label" value="label one"/></td>
                <td><span className="material-icons">delete</span></td>
              </tr>         
            </table>
          </div>
          <div className="legend-separator"></div>
          <div className="legend-temp-title">cadastral</div>
          <div className="legend-cadastral">
            <table class="legend-cadastral-table">
                <tr>
                  <th>Color</th>
                  <th>Label</th>
                  <th></th>
                </tr>
                <tr>
                  <td><div class="legend-bin-color"></div></td>
                  <td><input type="text" className="legend-cadastral-label" value="label one"/></td>
                  <td><span className="material-icons">delete</span></td>
                </tr>         
              </table>
          </div>
        </div>
       
      </div>
    );
  };
  
  export default Legend;