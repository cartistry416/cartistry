import React, { useState, useContext } from 'react'
import AuthContext from '../auth';
function LoginModal(props) {

    const {auth} = useContext(AuthContext);

    const [successfulLogin, setSuccessfulLogin] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = e.target[0].value
      const password = e.target[1].value
     
      const {success, errorMessage} = await auth.loginUser(email, password)
      setSuccessfulLogin(success)
      setErrorMessage(errorMessage)
    };

    let dummyNode = <div></div>
    if(successfulLogin){
      dummyNode = <div id="dummyLoginData">Hello! {auth.user.userName}</div>
    }
  
    return (
      <div>
        {dummyNode}
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              id="email"
              type="email"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              id="password"
              type="password"
              required
            />
          </div>
          <div>
            <button type="submit">Log In</button>
          </div>
        </form>
        <div> {errorMessage} </div>
      </div>
    );


}

export default LoginModal