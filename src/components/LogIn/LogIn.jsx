import React, {useState, useRef, useEffect} from "react";
import "./LogIn.css";
import {useAppContext} from "../../context/AppContext";
import {Link} from "react-router-dom";

const LogIn = () => {
  const [input, setInput] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const serverUrl = process.env.REACT_APP_API_URL;

  const {userData, setUserData, handleLogin, handleLogout, champions, loading, error, username, setUsername, password, setPassword, setError} = useAppContext();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setIsFocused(false);
        setFilteredNames([]);
        setInput("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, inputRef]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Clear the error after 3 seconds
      }, 3000);

      // Clean up the timer when the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const changeJsonData = async (champion) => {
    try {
      const response = await fetch("http://localhost:3001/api/changeUser1Champion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({favChampion: champion, username: userData.username}),
      });
      if (response.ok) {
        const updatedUser1 = await response.json();
        setUserData(updatedUser1);
      } else {
        console.error("Error changing champion in JSON");
      }
    } catch (err) {
      console.error("Error changing champion in JSON");
    }
  };

  const handleInputChange = (e) => {
    if (loading) return;
    const value = e.target.value;
    const upperCase = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setInput(upperCase);
    if (!upperCase) {
      setFilteredNames([]);
      setSelectedIndex(-1);
      return;
    }
    const filtered = Object.keys(champions).filter((name) => name.toLowerCase().startsWith(upperCase.toLowerCase()));
    setFilteredNames(filtered);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 40:
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredNames.length - 1 ? prev + 1 : prev));
        break;
      case 38:
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 13:
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleListItemClick(filteredNames[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setFilteredNames([]);
    setInput("");
  };

  const handleInputFocus = () => {
    if (loading) return;
    setIsFocused(true);
    if (input === "") {
      setFilteredNames(Object.keys(champions));
      setSelectedIndex(-1);
    } else {
      setFilteredNames(Object.keys(champions).filter((name) => name.toLowerCase().startsWith(input.toLowerCase())));
    }
  };

  const handleListItemClick = (name) => {
    setInput(name);
    changeJsonData(name);
    setFilteredNames([]);
    setSelectedIndex(-1);
    setInput("");
    setIsFocused(false);

    inputRef.current.blur();
  };

  const handleImageClick = () => {
    if (loading) return;
    setIsFocused(true);
    setFilteredNames(Object.keys(champions));
    setSelectedIndex(-1);
    inputRef.current.focus();
  };

  return (
    <section className="login">
      {!userData ? (
        <section className="login-section">
          <section className="login-inputs">
            <section className="login-input">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </section>
            <section className="login-input">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </section>
          </section>
          <section className="login-buttons">
            <button className="login-button" onClick={() => handleLogin(username, password)}>
              Login
            </button>
            <Link to="/register">
              <button className="register-button">Register</button>
            </Link>
          </section>

          {error && <p className="error">{error}</p>}
        </section>
      ) : (
        <section className="logined">
          <section className="users-info">
            <section className="users-welcome">
              <h1>Welcome, {userData.username}</h1>
            </section>
            <section className="users-name">
              <p>Username:</p>
              <p className="info-details">{userData.username}</p>
            </section>
            <section className="users-champion">
              <p>Favorite Champion:</p>
              <div className="info-details">{userData.favChampion && <img src={`${serverUrl}/images/champion-pfp/${userData.favChampion}.png`} alt={userData.favChampion} key={userData.favChampion} onClick={handleImageClick} />}</div>
              <div ref={dropdownRef} className="user-champion-choice">
                <input className="user-champion-input" type="text" value={input} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} onKeyDown={handleKeyDown} placeholder="Enter champion name" ref={inputRef} style={{display: isFocused ? "block" : "none"}} />
                {isFocused && filteredNames.length > 0 ? (
                  <ul className="user-filtered-names">
                    {filteredNames.slice(0, 4).map((name, index) => (
                      <li className="user-champion-select" key={name} onMouseDown={(e) => e.preventDefault()} onClick={() => handleListItemClick(name)} onMouseEnter={() => setSelectedIndex(index)} style={{backgroundColor: index === selectedIndex ? "#7f7f7f" : "transparent"}}>
                        <img className="user-champion-select-img" src={`${serverUrl}/images/champion-pfp/${name}.png`} alt={`${name} img`} loading="lazy" />
                        <p className="user-champion-select-name">{name}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
            <section className="users-quote">
              <p>Favorite Quote:</p>
              <p className="info-details">Some quote here...</p>
            </section>
            <section className="users-background">
              <p>Background:</p>
              <p className="info-details">Some background here...</p>
            </section>
          </section>

          <button
            className="user-champion-new-guess-button"
            onClick={() => {
              handleLogout();
              setPassword("");
            }}
          >
            Logout
          </button>
        </section>
      )}
    </section>
  );
};

export default LogIn;
