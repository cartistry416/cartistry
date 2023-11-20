import React from 'react';

function SuccessfulLoginLogoutModal({ message }) {
  return (
    <div className="modalWrapper">
      <div className="modal lowPosition">
        <span>{message}</span>
      </div>
    </div>
  );
}

export default SuccessfulLoginLogoutModal;
