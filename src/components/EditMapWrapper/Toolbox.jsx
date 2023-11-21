import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import "../../static/css/editMap/toolBox.css";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import AuthContext from "../../auth";
import GlobalMapContext from "../../contexts/map";

const Toolbox = (props) => {
  const { auth } = useContext(AuthContext);
  const { map } = useContext(GlobalMapContext);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dropdownRef = useRef(null);
  const [newTitle, setNewTitle] = useState("");
  const [mapId, setMapId] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (map.currentMapMetadata) {
      setNewTitle(map.currentMapMetadata.title)
      setMapId(map.currentMapMetadata._id)
    }
  }, [map.currentMapMetadata])

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    setIsEditing(true);
  };

  const handleTitleChange = (event) => {
    event.stopPropagation();
    setNewTitle(event.target.value);
  };

  const handleTitleSubmit = (event) => {
    if (event.key === "Enter") {
      map.renameMap(mapId, newTitle, -1);
      setIsEditing(false);
    }
  };

  const handleExport = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    map.exportMap(mapId, auth.user.userId);
  };

  const handlePublish = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    navigate(`/editPost/${mapId}`)
  };

  const handleFork = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    map.forkMap(mapId);
  };

  const onDeleteClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    setShowModal(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    map.deleteMap(mapId);
    setShowModal(false);
    navigate("/myMaps");
  };

  const onSaveClick = (e) => {
    e.stopPropagation();
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  return (
    <div className="toolbox">
      <div className="toolbox-header">
        {isEditing ? (
          <input
            className="mapCardTitleInput2"
            value={newTitle}
            onClick={(e) => e.stopPropagation()}
            onChange={handleTitleChange}
            onKeyDown={handleTitleSubmit}
            autoFocus
          />
        ) : (
          <div className="mapCardTitle">{newTitle}</div>
        )}
        <div ref={dropdownRef}>
          <span className="material-icons" onClick={toggleMenu}>
            more_vert
          </span>
          {showOptions && (
            <div className="mapCardMenu2">
              <div className="mapCardMenuItem" onClick={handleExport}>
                <span className="material-icons">ios_share</span>
                Export
              </div>
              <div className="mapCardMenuItem" onClick={handlePublish}>
                <span className="material-icons">publish</span>
                Publish
              </div>
              <div className="mapCardMenuItem" onClick={handleFork}>
                <span className="material-icons">fork_right</span>
                Fork
              </div>
              <div className="mapCardMenuItem" onClick={handleRename}>
                <span className="material-icons">edit</span>
                Rename
              </div>
              <div className="mapCardMenuItem" onClick={onDeleteClick}>
                <span className="material-icons">delete</span>
                Delete
              </div>
              <div className="mapCardMenuItem" onClick={onSaveClick}>
                <span className="material-icons">save</span>
                Save
              </div>
            </div>
          )}
        </div>
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
            <input
              type="range"
              className="toolbox-pan-range"
              min="0"
              max="100"
              value="50"
            />
            <div className="toolbox-pan-controls-inner">
              <div className="toolbox-pan-controls-buttons">
                <span className="material-icons">remove</span>
                <span className="material-icons">add</span>
              </div>
              <input
                type="number"
                className="toolbox-pan-zoom-value"
                value="50"
              />
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
              <input
                type="color"
                className="toolbox-gradient-controls-colorInput"
              />
            </div>
            <div className="toolbox-gradient-controls-row">
              <span className="toolbox-gradient-label">Min</span>
              <input
                type="number"
                className="toolbox-gradient-controls-numberInput"
                value="0"
              />
            </div>
            <div className="toolbox-gradient-controls-row">
              <span className="toolbox-gradient-label">Max</span>
              <input
                type="number"
                className="toolbox-gradient-controls-numberInput"
                value="100"
              />
            </div>
            <div className="toolbox-gradient-controls-row">
              <span className="toolbox-gradient-label">Sections</span>
              <input
                type="number"
                className="toolbox-gradient-controls-numberInput"
                value="4"
              />
            </div>
          </div>
        </div>
        {/* <input type="text" placeholder="Label" className="textInput" />
            <input type="color" className="colorInput" /> */}
      </div>
      {showModal && (
        <ConfirmDeleteModal
          onCancel={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default Toolbox;
