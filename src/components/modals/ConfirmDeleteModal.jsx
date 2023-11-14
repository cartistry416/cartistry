function ConfirmDeleteModal() {
    return (
      <div className="modalWrapper">
        <div className="modal">
          <div className="modalHeader">
            <h2>Confirm Delete</h2>
            <div className="material-icons">cancel</div>
          </div>
         <form> 
              <button className="formSubmitButton" type="submit">
                Confirm
              </button>
          </form>
        </div>
      </div>
    );
  }
  
  export default ConfirmDeleteModal;
  