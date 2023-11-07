import React, { useState, useContext } from 'react'
import AuthContext from '../auth';

function RegisterModal(props) {
  const { auth } = useContext(AuthContext);

    // eslint-disable-next-line
  const [successfulRegister, setSuccessfulRegister] = useState(false)
    // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value
    const username = e.target[1].value
    const password = e.target[2].value
    const passwordVerify = e.target[3].value

    const {success, errorMessage} = await auth.registerUser(email, password, passwordVerify, username)
    console.log(errorMessage)
    setSuccessfulRegister(success)
    setErrorMessage(errorMessage)
  };

  let dummyNode = <div></div>
  if(successfulRegister){
    dummyNode = <div id="registered">Registered</div>
  }

  return (
    <div>
      {dummyNode}
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            required
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="username"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div>
          <label>Verify Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );


}

export default RegisterModal