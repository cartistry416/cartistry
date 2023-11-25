function AlertModal({ errorMessage, onCancel, onReset }) {
  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Error</h2>
          <div className="material-icons" onClick={onCancel}>cancel</div>
        </div>
        <div className="alertModalMessage">{errorMessage}</div>
        { onReset && (
          <div className="modalFooter">
            <button className="modalButton" type="submit" onClick={onReset}>
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertModal;
