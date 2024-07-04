import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import "./LogRegBar.css"; // Make sure your CSS file path is correct

const LogRegBar = () => {
  const location = useLocation();
  const [sliderPosition, setSliderPosition] = useState("0%");
  const [activeHeight, setActiveHeight] = useState("3px");
  const [inactiveHeight, setInactiveHeight] = useState("1px");

  useEffect(() => {
    // Determine if we're on the login page
    const isLogin = location.pathname.includes("login");

    // Set the slider position and heights
    setSliderPosition(isLogin ? "0%" : "50%");
    setActiveHeight(isLogin ? "3px" : "3px");
    setInactiveHeight(isLogin ? "1px" : "1px");
  }, [location.pathname]);

  return (
    <div className="log-reg-bar">
      <div className="log-reg-bar-links">
        <Link to="/login" className={`log-reg-bar-link ${location.pathname.includes("login") ? "active" : ""}`}>
          Sign in
        </Link>
        <Link to="/register" className={`log-reg-bar-link ${location.pathname.includes("register") ? "active" : ""}`}>
          Sign up
        </Link>
        <div className="slider" style={{left: sliderPosition, height: activeHeight}}></div>
        <div className="inactive-slider" style={{left: sliderPosition === "0%" ? "50%" : "0%", height: inactiveHeight}}></div>
      </div>
    </div>
  );
};

export default LogRegBar;
