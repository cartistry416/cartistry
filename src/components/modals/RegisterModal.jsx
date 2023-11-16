import React, { useState, useContext } from "react";
import AuthContext from "../../auth";

function RegisterModal(props) {
  const { auth } = useContext(AuthContext);

  // eslint-disable-next-line
  const [successfulRegister, setSuccessfulRegister] = useState(false);
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState("");

  // eslint-disable-next-line
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const username = e.target[1].value;
    const password = e.target[2].value;
    const passwordVerify = e.target[3].value;

    const { success, errorMessage } = await auth.registerUser(
      email,
      password,
      passwordVerify,
      username
    );
    console.log(errorMessage);
    setSuccessfulRegister(success);
    setErrorMessage(errorMessage);
  };
  
// eslint-disable-next-line
  let dummyNode = <div></div>;
  if (successfulRegister) {
    dummyNode = <div id="registered">Registered</div>;
  }

  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="modalHeader">
          <h2>Register</h2>
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
              placeholder="username"
              type="text"
              id="username"
              name="username"
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
