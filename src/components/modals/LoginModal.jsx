//dummy commit
import React, { useState, useContext } from "react";
import AuthContext from "../../auth";
import "../../static/css/modals.css";
function LoginModal() {
  const { auth } = useContext(AuthContext);

  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const { success, errorMessage } = await auth.loginUser(email, password);
    setSuccessfulLogin(success);
    setErrorMessage(errorMessage);
  };

  let dummyNode = <div></div>;
  if (successfulLogin) {
    dummyNode = <div id="dummyLoginData">Hello! {auth.user.userName}</div>;
  }

  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Login</h2>
          <div className="material-icons">cancel</div>
        </div>
        <form>
          <div>
            <input
              placeholder="email"
              type="text"
              id="email"
              name="email"
              required
            />
          </div>
          <div>
            <input
              placeholder="password"
              type="text"
              id="password"
              name="password"
              required
            />
          </div>
          <div className="modalFooter">
            <button className="forgotPassModalButton">Forgot Password</button>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
