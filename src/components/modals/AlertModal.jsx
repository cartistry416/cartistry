function AlertModal({ errorMessage, onCancel, onReset }) {
  const cancel = (e) => {
    e.stopPropagation();
    onCancel();
  };
  const reset = (e) => {
    e.stopPropagation();
    onReset();
  };
  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Error</h2>
          <div className="material-icons" onClick={cancel}>
            cancel
          </div>
        </div>
        <div className="alertModalMessage">{errorMessage}</div>
        {onReset && (
          <div className="modalFooter">
            <button className="modalButton" type="submit" onClick={reset}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertModal;
