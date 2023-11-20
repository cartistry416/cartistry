import React, { useContext } from "react";
import AuthContext from "../auth";
import { useNavigate } from "react-router";

function ResetPasswordScreen() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    await auth.resetPassword(e.target[0].value, e.target[1].value)
  };

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
              <button type="submit">Reset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordScreen;
