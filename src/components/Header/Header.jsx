import React from "react";
import {Link} from "react-router-dom";
import {useAppContext} from "../../context/AppContext";
import "./Header.css";
import config from "../../config/config";

const Header = () => {
  const {userData, setPassword, setUsername} = useAppContext();
  const serverUrl = config.REACT_APP_API_URL;

  const handleLogout = () => {
    // Reset the username and password fields
    setUsername("");
    setPassword("");
  };
  return (
    <section className="heading">
      <nav className="nav-bar">
        <Link to="/" className="nav-link" onClick={handleLogout}>
          <h1 className="league-of-quotes-heading">League of quotes</h1>
        </Link>
        <section className="bottom-links">
          <div className="tooltip-container">
            <Link to="/login" className="nav-link">
              <img src={userData?.favChampion ? `${serverUrl}/images/champion-pfp/${userData.favChampion}.png` : `${serverUrl}/images/profile/default-pfp.png`} alt="profile-pfp" className="profile-pfp" />
            </Link>
            <span className="tooltip-text">Profile</span>
          </div>
        </section>
      </nav>
    </section>
  );
};

export default Header;
