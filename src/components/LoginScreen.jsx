import React, { useState, useContext, useRef} from "react";
import AuthContext from "../auth";
import { useNavigate } from "react-router";
import AlertModal from "./modals/AlertModal";

function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef();

  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { success, errorMessage } = await auth.loginUser(email, password);
    if (success) {
      navigate('/home')
    } else {
      setErrorMessage(errorMessage);
      setShowError(true);
    }
    setSuccessfulLogin(success);
  };

  const redirectTo = (path) => {
    navigate(path);
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setShowError(false);
  };

  if (auth.getLoggedIn)
    return (
      <div className="authScreenWrapper">
        <span className="authScreenLogotype">Cartistry</span>
        <div className="authWrapper">
          <form ref={formRef} onSubmit={handleSubmit}>
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
                type="password"
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
        {showError && (
          <AlertModal errorMessage={errorMessage} onCancel={() => setShowError(false)} onReset={handleReset} />
        )}
      </div>
    );
}

export default LoginScreen;
