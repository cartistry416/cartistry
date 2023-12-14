function ConfirmDeleteModal({ onCancel, onConfirm }) {
  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Confirm Delete</h2>
          <div className="material-icons" onClick={onCancel}>cancel</div>
        </div>
        <button className="modalButton" type="button" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
