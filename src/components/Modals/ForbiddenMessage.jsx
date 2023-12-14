import React from 'react'
import { useNavigate } from 'react-router'

const ForbiddenMessage = () => {
  const navigate = useNavigate();

  return (
    <div className='forbidden-wrapper'>
      <h3>Oops...</h3>
      <span>Looks like you don't have access to this screen. Let's get you back on the right path!</span>
      <button onClick={() => navigate('/home')}>Back to Home</button>
    </div>
  )
}

export default ForbiddenMessage