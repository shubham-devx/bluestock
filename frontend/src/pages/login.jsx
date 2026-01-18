// import { loginApi } from "../api/authApi";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await loginApi(email, password);

//     // Save JWT
//     localStorage.setItem("token", res.data.token);

//     // Redirect
//     navigate("/dashboard");
//   } catch (err) {
//     alert(err.response?.data?.message || "Login failed");
//   }
// };


//   return (
//     <div style={styles.container}>
//       <form style={styles.form} onSubmit={handleLogin}>
//         <h2>Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           autoComplete="email"
//           style={styles.input}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           autoComplete="current-password"
//           style={styles.input}
//         />

//         <button type="submit" style={styles.button}>
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f5f5f5",
//   },
//   form: {
//     background: "#fff",
//     padding: "30px",
//     borderRadius: "8px",
//     width: "300px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "14px",
//   },
//   button: {
//     padding: "10px",
//     background: "#007bff",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
// };

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "./login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firebase login
      

      // Backend JWT
      // const res = await axios.post(
      //   "http://localhost:5000/login",
       
      //   {
      //     email,
      //     password,
          
        
      //   });

const userCred=await signInWithEmailAndPassword(
  auth,
  email.trim(),
  password.trim()
);
alert("Login successful");
navigate("/dashboard");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        {/* LEFT SECTION */}
        <div className="login-left">
          <div className="placeholder-text">Created By Shubham Sir</div>
        </div>

        {/* RIGHT SECTION */}
        <div className="login-right">
          <h2>Login as a Company</h2>

          <form onSubmit={handleLogin}>
            <label>Email ID</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* <span className="otp-link">Login with OTP</span> */}

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span className="forgot"
            onClick={()=>navigate("/forgot-password")}
            style={{cursor:"pointer",color:"#1976d2"}}
            >🔒 Forgot Password?
            </span>

            <button disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account?{ " "} 
            <span
            style={{color:"#5b8cff",cursor:"pointer", fontWeight:"600"}}
            onClick={()=> navigate("/register")}
            >Sign up</span>
          </p>
        </div>

      </div>
    </div>
  );
}