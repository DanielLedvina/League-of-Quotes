import React, {useState, useEffect} from "react";
import Header from "../Header/Header";
import LogIn from "../LogIn/LogIn";
import RegistrationDlg from "../RegistrationDlg/RegistrationDlg";
import "./Profile.css";
import {useLocation} from "react-router-dom";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Check if coming from registration
    if (location.state?.fromRegistration) {
      setModalMessage(location.state.message);
      setShowModal(true);
    }
  }, [location]);

  return (
    <section className='profile'>
      <Header />
      <LogIn />
      {/* {showModal && (
        <RegistrationDlg isOpen={showModal} onClose={() => setShowModal(false)}>
          <p>{modalMessage}</p>
        </RegistrationDlg>
      )} */}
    </section>
  );
};

export default Profile;
