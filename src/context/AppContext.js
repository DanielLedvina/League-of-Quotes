import React, {createContext, useState, useEffect, useContext} from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [userData, setUserData] = useState(null);
  const [champions, setChampions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchUserData = async () => {
    console.log("Starting to fetch user data...");
    setLoadingUser(true);
    try {
      const response = await fetch("http://localhost:3001/api/user", {
        credentials: "include",
      });
      console.log("HTTP Status Code:", response.status); // Log the status code
      if (response.ok) {
        const data = await response.json();
        console.log("User data received:", data);
        setUserData(data);
        setError("");
      } else {
        console.log("Response not OK. Status:", response.status, response.statusText);
        setUserData(null);
        setError("Failed to fetch user data: " + response.statusText);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setUserData(null);
      setError("Failed to fetch user data");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchChampions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/champions");
      setChampions(response.data?.quotes?.champions || {});
    } catch (error) {
      console.error("Error fetching champions data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (usernameInput, passwordInput) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: usernameInput, password: passwordInput}),
      });

      if (!response.ok) throw setError("Invalid username or password");

      await fetchUserData();
      setError("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("Error logging in");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUserData(null);
        setUsername("");
        setPassword("");
        setError("");
      } else {
        console.error("Failed to log out");
      }
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        champions,
        loading,
        loadingUser,
        handleLogin,
        handleLogout,
        fetchUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
