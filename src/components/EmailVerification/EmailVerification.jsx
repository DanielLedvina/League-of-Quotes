// import React, {useEffect, useState} from "react";
// import {useParams, useNavigate} from "react-router-dom";

// const EmailVerification = () => {
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const {token} = useParams(); // Assuming you're using react-router

//   useEffect(() => {
//     const verifyEmail = async () => {
//       const response = await fetch(`http://localhost:3001/api/verify-email?token=${token}`);
//       const data = await response.json();
//       setMessage(data.message);
//       setLoading(false);
//       setTimeout(() => navigate("/login"), 5000); // Redirect to login after 5 seconds
//     };

//     verifyEmail();
//   }, [token, navigate]);

//   return <div>{loading ? <p>Verifying...</p> : <p>{message}</p>}</div>;
// };

// export default EmailVerification;
