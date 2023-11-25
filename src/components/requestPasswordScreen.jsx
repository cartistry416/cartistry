import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../auth";
import AlertModal from "./modals/AlertModal";

function RequestPasswordScreen() {
  const { auth } = useContext(AuthContext);
  let navigate = useNavigate();
  const formRef = useRef();

  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const { success, errorMessage } = await auth.requestPasswordToken(email);
    if (success){
      setStage(2);
    } else {
      setErrorMessage(errorMessage);
      setShowError(true);
    }
  };

  const handleSubmitToken = async (e) => {
    e.preventDefault();
    const token = e.target.token.value;
    
  };

  const redirectTo = (path) => {
    navigate(path);
  };

  return (
    <div className="authScreenWrapper">
      <span className="authScreenLogotype">Cartistry</span>
      <div className="authWrapper">
        {stage === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <div>
              <input
                placeholder="email"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="authFooter">
              <div className="authFooterContent">
                <button className="authAltButton" onClick={() => redirectTo("/")}>
                  Cancel
                </button>
                <button type="submit">
                  Send Token
                </button>
              </div>
            </div>
          </form>
        )}
        {stage === 2 && (
          <form onSubmit={handleSubmitToken}>
            <div>
              <input
                placeholder="Enter Token"
                type="text"
                id="token"
                name="token"
                required
              />
            </div>
            <div className="authFooter">
              <div className="authFooterContent">
                <button className="authAltButton" onClick={() => setStage(1)}>
                  Back
                </button>
                <button type="submit">
                  Submit Token
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      {showError && (
        <AlertModal errorMessage={errorMessage} onCancel={() => setShowError(false)} />
      )}
    </div>
  );
}

export default RequestPasswordScreen;
