import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth'; // Adjust the path as necessary

function SuccessfulLoginModal() {
  const [showModal, setShowModal] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.loggedIn) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  }, [auth.loggedIn]);

  return (
    <div className={showModal ? "modalWrapper show" : "modalWrapper"}>
      <div className="modal lowPosition">
        <span>You are now logged in. You will soon be redirected</span>
      </div>
    </div>
  );
}

export default SuccessfulLoginModal;
