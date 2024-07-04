import React, {useState, useEffect} from "react";
import {Header, RegistrationDlg} from "../../components";
import {Navigate, Link} from "react-router-dom";
import LogRegBar from "../LogRegBar/LogRegBar";
import config from "../../config/config";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirect, setRedirect] = useState(null);
  const serverUrl = config.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    setModalMessage(data.message);
    setShowModal(true);

    if (response.ok) {
      setRedirect({
        pathname: "/login",
        state: {fromRegistration: true, message: "Registration Successful!"},
      });
    }
  };

  return (
    <section className="register">
      <Header />
      <LogRegBar />
      <form onSubmit={handleSubmit}>
        <section className="register-inputs">
          <section className="input-container">
            <img src="/images/emotes/email-envelope.webp" alt="email-envelope" className="input-icon email-envelope" />
            <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} />
          </section>
          <section className="input-container">
            <img src={`${serverUrl}/images/profile/default-pfp.png`} alt="default-pfp" className="input-icon" />
            <input name="username" type="text" placeholder="Enter your username" onChange={handleChange} />
          </section>
          <section className="input-container">
            <img src="/images/emotes/key-password.webp" alt="key-password" className="input-icon" />
            <input name="password" type="password" placeholder="Enter your password" onChange={handleChange} />
          </section>

          <section className="register-buttons">
            <button className="register-button" type="submit">
              Sign up
            </button>
          </section>
        </section>
      </form>
      <RegistrationDlg isOpen={showModal} onClose={() => setShowModal(false)}>
        <p>{modalMessage}</p>
      </RegistrationDlg>
      {redirect && <Navigate to={redirect.pathname} state={redirect.state} replace />}
    </section>
  );
};

export default Register;
