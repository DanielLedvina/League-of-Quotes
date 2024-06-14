import React from "react";

const RegistrationDlg = ({isOpen, onClose, children}) => {
  if (!isOpen) return null;

  return (
    <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div style={{padding: 20, background: "#fff", borderRadius: 5, width: "80%", maxWidth: 500}}>
        {children}
        <button onClick={onClose} style={{marginTop: 20}}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RegistrationDlg;
