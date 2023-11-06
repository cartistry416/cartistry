import React, { useState } from 'react'

function RegisterModal(props) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = e.target[0].value
      const username = e.target[1].value
      const password = e.target[2].value
      const passwordVerify = e.target[3].value
    };
  
    return (
      <div>
        <h2>Login</h2>
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
            <button type="submit">Log In</button>
          </div>
        </form>
      </div>
    );


}

export default RegisterModal