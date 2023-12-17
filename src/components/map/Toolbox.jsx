import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import "../../static/css/editMap/toolBox.css";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import AuthContext from "../../auth";
import GlobalMapContext from "../../contexts/map";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import * as L from "leaflet";

const Toolbox = ({ mapRef }) => {
  const { auth } = useContext(AuthContext);
  const { map } = useContext(GlobalMapContext);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dropdownRef = useRef(null);
  const [newTitle, setNewTitle] = useState("");
  const [mapId, setMapId] = useState("");
  const navigate = useNavigate();
  const [currentMarkerIcon, setCurrentMarkerIcon] = useState("defaultIcon");
  const [numColors, setNumColors] = useState(1);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      map.setColorSelected("#3388ff");
    };
  }, []);

  useEffect(() => {
    if (map.currentMapMetadata) {
      // console.log("switched map, title is: "+ map.currentMapMetadata.title)
      setNewTitle(map.currentMapMetadata.title);
      setMapId(map.currentMapMetadata._id);
    }
  }, [map.currentMapMetadata]);

  useEffect(() => {
    if (mapRef) {
      mapRef.pm.Draw.shapes.map((shape) =>
        mapRef.pm.Draw[shape].setOptions({
          templineStyle: { color: map.colorSelected },
          hintlineStyle: { color: map.colorSelected },
        })
      );
    }
  }, [map.colorSelected]);

  const createIcon = useCallback(
    (iconName) => {
      return L.divIcon({
        className: "custom-icon",
        html: `<span class="material-icons" style="color: ${map.colorSelected};">${iconName}</span>`,
        iconSize: L.point(50, 50),
      });
    },
    [map.colorSelected]
  );

  const icons = useMemo(
    () => ({
      default: createIcon("location_on"),
      apartment: createIcon("apartment"),
      restaurant: createIcon("restaurant"),
      school: createIcon("school"),
      museum: createIcon("museum"),
      store: createIcon("store"),
      home: createIcon("home"),
      church: createIcon("church"),
    }),
    [map.colorSelected]
  );

  const currentLIcon = icons[currentMarkerIcon] || icons["default"];

  useEffect(() => {
    if (mapRef) {
      const markerHandler = mapRef.pm.Draw.Marker;
      console.log("test");
      if (markerHandler) {
        markerHandler.setOptions({
          markerStyle: {
            icon: currentLIcon,
          },
        });
      }
    }
  }, [mapRef, currentLIcon, map.colorSelected]);

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
    navigate(`/editPost/${mapId}`);
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

  const handleSave = (e) => {
    e.stopPropagation();
    if (!mapRef) {
      alert("no map ref");
      return;
    }

    const snapshotOptions = {
      hideElementsWithSelectors: [".leaflet-control-container"],
      hidden: true,
    };

    const screenshotter = new SimpleMapScreenshoter(snapshotOptions);
    screenshotter.addTo(mapRef);
    screenshotter.takeScreen("image").then((image) => {
      map.saveMapEdits(mapId, image);
      setShowOptions(false);
    });
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleColorSelectorChange = (e) => {
    map.setColorSelected(e.target.value);
  };

  const handleNumColorsChange = (e) => {
    setNumColors(e.target.value);
  };

  const handleHeatColorSelectorChange = (index, color) => {
    map.setHeatColors(index, color, numColors);
  };

  const handleIconClick = (e, iconType) => {
    // console.log(e);
    // console.log(iconType);
    setCurrentMarkerIcon(iconType);
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
          <span className="material-icons mapCardMore" onClick={toggleMenu}>
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
              <div className="mapCardMenuItem" onClick={handleSave}>
                <span className="material-icons">save</span>
                Save
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="toolbox-body">
        <div className="toolbox-controls">
          {map.markerActive && (
            <>
              <div className="toolbox-landmark-controls">
                <div className="toolbox-landmark-iconRows">
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "default")}
                  >
                    location_on
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "apartment")}
                  >
                    apartment
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "restaurant")}
                  >
                    restaurant
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "school")}
                  >
                    school
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "museum")}
                  >
                    museum
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "store")}
                  >
                    store
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "home")}
                  >
                    home
                  </span>
                  <span
                    className="material-icons"
                    onClick={(e) => handleIconClick(e, "church")}
                  >
                    church
                  </span>
                </div>
              </div>
              <div className="toolbox-separator"></div>
            </>
          )}
          <div className="toolbox-gradient-controls">
            {map.currentMapProprietaryJSON &&
            map.currentMapProprietaryJSON.templateType === "heat" ? (
              <div className="toolbox-gradient-controls-row">
                <span className="toolbox-gradient-label"># of Colors</span>
                <input
                  type="number"
                  defaultValue={1}
                  className="toolbox-gradient-controls-numberInput"
                  onChange={handleNumColorsChange}
                />
              </div>
            ) : (
              <div className="toolbox-gradient-controls-row">
                <span className="toolbox-gradient-label">Color</span>
                <input
                  type="color"
                  defaultValue={"#3388ff"}
                  className="toolbox-gradient-controls-colorInput"
                  onChange={handleColorSelectorChange}
                />
              </div>
            )}
            {map.currentMapProprietaryJSON &&
              map.currentMapProprietaryJSON.templateType === "heat" && (
                <div>
                  {Array.from({ length: numColors }, (v, index) => (
                    <div className="heatColorInput">
                      <span className="toolbox-gradient-label">
                        Color {index + 1}
                      </span>
                      <input
                        type="color"
                        defaultValue={"#3388ff"}
                        className="toolbox-gradient-controls-colorInput"
                        onChange={(e) =>
                          handleHeatColorSelectorChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            <div className="toolbox-gradient-controls-row">
              <span className="toolbox-gradient-label">Min</span>
              <input
                type="number"
                className="toolbox-gradient-controls-numberInput"
              />
            </div>
            <div className="toolbox-gradient-controls-row">
              <span className="toolbox-gradient-label">Max</span>
              <input
                type="number"
                className="toolbox-gradient-controls-numberInput"
              />
            </div>
            <div className="toolbox-gradient-controls-row">
              <span className="toolbox-gradient-label">Sections</span>
              <input
                type="number"
                className="toolbox-gradient-controls-numberInput"
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
