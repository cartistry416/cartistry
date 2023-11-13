

const errorMessage = "No account assocaiated with email"

function ErrorModal() {
  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Error</h2>
          <div className="material-icons">cancel</div>
        </div>
        <div className="errorModalMessage">
            {errorMessage}
        </div>
        <div className="modalFooter">
          <div></div>
          <button className="formSubmitButton" type="submit">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
