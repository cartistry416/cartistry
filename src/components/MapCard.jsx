import { useState, useRef, useEffect, useContext } from "react";
import "../static/css/mapCard.css";
import { formatDate, getImage } from "../utils/utils";
import GlobalMapContext from "../contexts/map";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import AuthContext from "../auth";
import { useNavigate } from "react-router";

function MapCard(props) {
  const { auth } = useContext(AuthContext);
  const { map } = useContext(GlobalMapContext);
  const { index, mapId, title, updatedAt, thumbnail } = props;
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const dropdownRef = useRef(null);
  const imageUrl = thumbnail ? getImage(thumbnail.imageData) : "/";

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setNewTitle(title)
  }, [title])

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
      if (newTitle === title || newTitle === "") {
        setIsEditing(false);
        setNewTitle(title);
        return;
      }
      map.renameMap(mapId, newTitle, index);
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
    navigate(`/editPost/${mapId}?type=a`);
  };

  const handleFork = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    map.forkMap(mapId, index, title);
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
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleMapCardClick = async (e) => {
    e.preventDefault();
    console.log(mapId)
    //map.exitCurrentMap()
    await map.loadMap(mapId);
    navigate(`/editMap/${mapId}`)
  };

  return (
    <div className="mapCardWrapper">
      <img
        src={imageUrl}
        onClick={handleMapCardClick}
        alt="map"
        className="mapCardImagePreview"
      ></img>
      <div className="mapCardDescription">
        <div className="mapCardInfo">
          {isEditing ? (
            <input
              className="mapCardTitleInput"
              value={newTitle}
              onClick={(e) => e.stopPropagation()}
              onChange={handleTitleChange}
              onKeyDown={handleTitleSubmit}
              autoFocus
            />
          ) : (
            <div className="mapCardTitle">{title}</div>
          )}
          <div className="mapCardDate">
            {"Opened "} {formatDate(updatedAt)}
          </div>
        </div>
        <div className="mapCardMore" ref={dropdownRef}>
          {showOptions && (
            <div className="mapCardMenu">
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
            </div>
          )}
          <span className="material-icons" onClick={toggleMenu}>
            more_vert
          </span>
        </div>
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
}

export default MapCard;
