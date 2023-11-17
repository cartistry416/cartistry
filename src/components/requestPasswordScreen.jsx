import React, { useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../auth";

function RequestPasswordScreen() {
  const { auth } = useContext(AuthContext);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("forgotPasswordLinkRequestSent");
  };

  const redirectTo = (path) => {
    navigate(path);
  };

  return (
    <div className="authScreenWrapper">
      <span className="authScreenLogotype">Cartistry</span>
      <div className="authWrapper">
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
          <div className="authFooter">
            <div className="authFooterContent">
              <button className="authAltButton" onClick={() => redirectTo("/")}>
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit}>
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestPasswordScreen;
