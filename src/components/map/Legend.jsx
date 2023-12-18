import { useState, useContext, useEffect } from "react";
import GlobalMapContext from "../../contexts/map";
import "../../static/css/editMap/legend.css";
//TODO: will need to redo this, legend is hardcoded for now

const Legend = () => {
    const { map, legendRef } = useContext(GlobalMapContext);
    const [title, setTitle] = useState(map.currentMapProprietaryJSONOriginal.legend.title)
    // pull legendPairs from global state
    const [legendPairs, setLegendPairs] = useState(map.currentMapProprietaryJSONOriginal.legend.keyValueLabels)
    const [isEditing, setIsEditing] = useState(true)
    
    useEffect(() => {
      legendRef.current = {
        keyValueLabels: legendPairs,
        title
      }
    }, [legendPairs, title])

    const markers = [
      "location_on",
      "apartment",
      "restaurant",
      "school",
      "museum",
      "store",
      "home",
      "church",
    ]

    const handleTitleChange = (event) => {
      event.stopPropagation();
      setTitle(event.target.value);
    };
  
    const handleTitleSubmit = (event) => {
      if(event.key === "Enter"){
        setIsEditing(false);
      }
    };

    const handleValueChange = (key, value) => {
      const newPairs = {
        ...legendPairs,
      }
      newPairs[key] = value
      setLegendPairs(newPairs)
    }

    const addNewLabel = () => {
      const color = getRandomHexColor();
      const newPairs = {
        ...legendPairs,
      }
      newPairs[color] = ''
      setLegendPairs(newPairs)
    }

    function getRandomHexColor() {
        const hexColor = '#000000'.replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
        });
        return hexColor;
    }

    const handleDeleteValue = (key) => {
      console.log(legendPairs)
      const newPairs = {
        ...legendPairs
      }
      delete newPairs[key]
      console.log(newPairs)
      setLegendPairs(newPairs)
    }

    return (
      <div className="legend">
        <div className="legend-header">
          {isEditing ? (
            <input
              className="legend-title-input"
              defaultValue={title}
              onClick={(e) => e.stopPropagation()}
              onChange={handleTitleChange}
              onKeyDown={handleTitleSubmit}
              autoFocus
            />
          ) : (
            <div
              className="legend-title"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </div>
          )}
        </div>
        <div className="legend-body">
          {(map.currentMapProprietaryJSON && (map.currentMapProprietaryJSON.templateType === "bin" || map.currentMapProprietaryJSON.templateType === "cadastral")) && (<div className="legend-bin">
            <table class="legend-bin-table">
              {Object.entries(legendPairs).map(([key, value], index) => (
                <tr key={key}>
                  <td><input type="color" defaultValue={key} onChange={(e) => handleValueChange(e.target.value, value)}></input></td>
                  <td><input type="text" className="legend-bin-color-label" defaultValue={value} onChange={(e) => handleValueChange(key, e.target.value)}/></td>
                  <td><span className="material-icons" onClick={() => handleDeleteValue(key)}>delete</span></td>
                </tr>
              ))}
              <tr>
                <td><button className="material-icons" onClick={addNewLabel}>add</button></td>
              </tr>
            </table>
          </div>)}
          {(map.currentMapProprietaryJSON && map.currentMapProprietaryJSON.templateType === "landmark") && (<div className="legend-landmark">
            <table class="legend-landmark-table">
              {markers.map(marker => (
                <tr>
                  <td><span className="material-icons">{marker}</span></td>
                  <td>
                    <input
                      type="text"
                      className="legend-landmark-label"
                      defaultValue={legendPairs[marker]}
                      onClick={(e) => handleValueChange(marker, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>)}
          {/* <div className="legend-temp-title">gradient</div>
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
          </div> */}
        </div>
      </div>
    );
  };
  
  export default Legend;