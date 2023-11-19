const errorMessage = "No account assocaiated with email";

function SuccessfulLoginModal() {
  return (
    <div className="modalWrapper show">
      <div className="modal lowPosition"> 
          <span>You are now logged in. You will soon be redirected</span>
      </div>
    </div>
  );
}

export default SuccessfulLoginModal;
