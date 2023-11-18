import React, { useState, useContext } from "react";
import AuthContext from "../auth";
import { useNavigate } from "react-router";

function RegisterScreen(props) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const redirectTo = (path) => {
    navigate(path);
  };

  return (
    <div className="authScreenWrapper">
      <span className="authScreenLogotype">Cartistry</span>
      <div className="authWrapper">
        <form onSubmit={handleSubmit}>
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
          <div className="authFooter">
            <div className="authFooterContent">
              <button className="authAltButton" onClick={() => redirectTo('/')}>Login</button>
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
