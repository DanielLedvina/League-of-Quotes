import React, {useState} from "react";
import {Header, RegistrationDlg} from "../../components";
import {Navigate} from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirect, setRedirect] = useState(null);

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
        pathname: "/profile",
        state: {fromRegistration: true, message: "Registration Successful!"},
      });
    }
  };

  return (
    <section>
      <Header />
      <form onSubmit={handleSubmit}>
        <input name='username' type='text' placeholder='Username' onChange={handleChange} />
        <input name='password' type='password' placeholder='Password' onChange={handleChange} />
        <input name='email' type='email' placeholder='Email' onChange={handleChange} />
        <input type='submit' value='Register' />
      </form>
      <RegistrationDlg isOpen={showModal} onClose={() => setShowModal(false)}>
        <p>{modalMessage}</p>
      </RegistrationDlg>
      {redirect && <Navigate to={redirect.pathname} state={redirect.state} replace />}
    </section>
  );
};

export default Register;
