import React, { useState, useContext, useRef } from "react";
import AuthContext from "../auth";
import { useNavigate } from "react-router";

function RegisterScreen(props) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef(); 

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
    // console.log(errorMessage);
    // console.log(success);
    setSuccessfulRegister(success);
    setErrorMessage(errorMessage);
    if(success){
      formRef.current.reset(); 
    }
  };

  // eslint-disable-next-line
  // let dummyNode = <div></div>;
  // if (successfulRegister) {
  //   dummyNode = <div id="registered">Registered</div>;
  // }

  const redirectTo = (path) => {
    navigate(path);
  };

  return (
    <div className="authScreenWrapper">
      <span className="authScreenLogotype">Cartistry</span>
      <div className="authWrapper">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div>
            <input
              placeholder="email"
              type="email"
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
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <div>
            <input
              placeholder="confirm password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
          {/* Display success or error message */}
          {successfulRegister ? (
            <div className="success-message">Successfully registered</div>
          ) : errorMessage ? (
            <div className="error-message">{errorMessage}</div>
          ) : null}
          <div className="authFooter">
            <div className="authFooterContent">
              <button className="authAltButton" onClick={() => redirectTo('/')}>Back</button>
              <button type="submit">Register</button>
            </div>
            <button className="authTopButton" onClick={() => redirectTo('/home')}>Continue as guest</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;
