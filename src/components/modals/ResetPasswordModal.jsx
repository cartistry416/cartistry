function ResetPasswordModal() {
    return (
      <div className="modalWrapper">
        <div className="modal">
          <div className="modalHeader">
            <h2>Reset Password</h2>
            <div className="material-icons">cancel</div>
          </div>
          <form>
            <div>
              <input
                placeholder="new password"
                type="text"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div>
              <input
                placeholder="confirm password"
                type="text"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>
            <div className="modalFooter">
              <div></div>
              <button className="formSubmitButton" type="submit">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default ResetPasswordModal;
  