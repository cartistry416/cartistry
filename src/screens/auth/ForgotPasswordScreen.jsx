import React, { useContext } from "react";
import AuthContext from "../../auth";
import { useNavigate } from "react-router";

function ForgotPasswordScreen() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("submit");
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
              placeholder="new password"
              type="password"
              id="newPassword"
              name="newPassword"
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
          <div className="authFooter">
            <div className="authFooterContent">
              <button className="authAltButton" onClick={() => redirectTo('/home')}>Cancel</button>
              <button type="submit" onClick={handleSubmit}>Reset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordScreen;
