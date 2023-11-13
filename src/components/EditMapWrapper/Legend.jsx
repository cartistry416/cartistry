const Legend = () => {
    return (
      <div className="legend">
        <div className="imagePreviewContainer">
          {/* Image Preview would be a component or an img tag depending on your implementation */}
          <div className="imagePreview">Image Preview</div>
        </div>
        <div className="textLabelContainer">
          <span className="textLabel">Text Label</span>
        </div>
        {/* Additional labels as required */}
        <div className="labelOneContainer">
          <span className="labelOne">Label One</span>
        </div>
        {/* ... other legend items */}
      </div>
    );
  };
  
  export default Legend;