import "../../static/css/editMap/editFeaturePopup.css";
import { useContext } from "react";
import GlobalMapContext from "../../contexts/map";

const EditFeaturePopup = (props) => {
  // const { map } = useContext(GlobalMapContext);
  const { feature, idx, handlePopupSubmit, layer, templateType } = props;

  console.log(templateType)

  return (
    <div id={`featurePopUp${idx}`}>
      <h3>Edit Feature Properties</h3>
      {feature && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePopupSubmit(e, feature, idx, layer);
          }}
        >
          <label>
            Name
            <input
              type="text"
              className="mapEditInput"
              defaultValue={feature.properties.name}
            />
          </label>
          {(templateType === "choropleth") && (
            <label>
              Value
              <input type="number" className="mapEditInput" />
            </label>
          )}

          {(templateType === "bin") && (
            <>
            <label>
            Fill Color
            <input
              type="color"
              className='mapEditInput'
              defaultValue={feature.properties.style.fillColor}
            />
            </label>
            <label>
            Border Color
            <input
              type="color"
              className='mapEditInput'
              defaultValue={feature.properties.style.color}
            />
            </label>
            <label>
            Weight 
            <input
              type="number"
              className='mapEditInput'
              defaultValue={feature.properties.style.weight}
            />
            </label>
            <label>
            Opacity
            <input
              type="number"
              className='mapEditInput'
              defaultValue={feature.properties.style.opacity}
            />
            </label>
            <label>
            Fill Opacity
            <input
              type="number"
              className='mapEditInput'
              defaultValue={feature.properties.style.fillOpacity}
            />
            </label>
            </>
          )}


          <button type="submit">Save Edit</button>
        </form>
      )}
    </div>
  );
};

export default EditFeaturePopup;
