import { useState, useRef, useEffect, useContext } from "react";
import "../static/css/mapCard.css";
import { formatDate, getImage } from "../utils/utils";
import GlobalMapContext from "../contexts/map";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import AuthContext from "../auth";
import { useNavigate } from "react-router";

function MapCard(props) {
  const { auth } = useContext(AuthContext)
  const { map } = useContext(GlobalMapContext)
  const { index, mapId, title, updatedAt, thumbnail } = props
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const dropdownRef = useRef(null)
  const imageUrl = thumbnail ? getImage(thumbnail.imageData) : '/'

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const redirectToEdit = () => {
    navigate(`/editMap/${mapId}`)
  }

  const handleRename = () => {
    setShowOptions(false);
    setIsEditing(true);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleTitleSubmit = (event) => {
    if (event.key === 'Enter') {
      map.renameMap(mapId, newTitle, index);
      setIsEditing(false);
    }
  };

  const handleExport = () => {
    setShowOptions(false)
    map.exportMap(mapId, auth.user.userId)
  }

  const handlePublish = () => {
    setShowOptions(false)
    // TODO: go to edit post screen
  }

  const handleFork = () => {
    setShowOptions(false)
    map.forkMap(mapId)
  }

  const onDeleteClick = () => {
    setShowOptions(false)
    setShowModal(true)
  }

  const handleDelete = () => {
    map.deleteMap(mapId)
  }

  return (
    <div className="mapCardWrapper">
      <img src={imageUrl} alt='map' className="mapCardImagePreview" onClick={redirectToEdit}></img>
      <div className="mapCardDescription">
        <div className="mapCardInfo">
          {isEditing ? (
            <input
              className="mapCardTitleInput"
              value={newTitle}
              onChange={handleTitleChange}
              onKeyDown={handleTitleSubmit}
              autoFocus
            />
          ) : (
            <div className="mapCardTitle" onClick={redirectToEdit}>{title}</div>
          )}
          <div className="mapCardDate">{'Opened '} {formatDate(updatedAt)}</div>
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
          <span className="material-icons" onClick={() => setShowOptions(!showOptions)}>more_vert</span>
        </div>
      </div>
      {showModal && (
        <ConfirmDeleteModal onCancel={() => setShowModal(false)} onConfirm={handleDelete} />
      )}
    </div>
  );
}

export default MapCard;
