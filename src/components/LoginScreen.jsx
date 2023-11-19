import React, { useState, useContext, useEffect} from "react";
import AuthContext from "../auth";
import { useNavigate } from "react-router";

function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (successfulLogin) {
      navigate('/home');
    }
  }, [successfulLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const { success, errorMessage } = await auth.loginUser(email, password);
    // console.log(success);
    setSuccessfulLogin(success);
    setErrorMessage(errorMessage);
  };

  const redirectTo = (path) => {
    navigate(path);
  };

  if (auth.getLoggedIn)
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
                placeholder="password"
                type="text"
                id="password"
                name="password"
                required
              />
            </div>
            <div className="authFooter">
              <div className="authFooterContent">
                <button className="authAltButton" onClick={() => redirectTo('/requestPassword')}>Forgot Password</button>
                <button type="submit">Login</button>
              </div>
              <button className="authTopButton" onClick={() => redirectTo('/register')}>Register an account</button>
              <button className="authBottomButton" onClick={() => redirectTo('/home')}>Continue as guest</button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default LoginScreen;
