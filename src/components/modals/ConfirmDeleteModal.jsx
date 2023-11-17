function ConfirmDeleteModal() {
  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Confirm Delete</h2>
          <div className="material-icons">cancel</div>
        </div>
        <button className="modalButton" type="submit">
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
