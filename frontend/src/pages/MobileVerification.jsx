// import { useState, useEffect } from "react";
// import { auth } from "../firebase";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber
// } from "firebase/auth";
// import axios from "axios";

// export default function MobileVerification() {
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [confirmation, setConfirmation] = useState(null);
//   const [timer, setTimer] = useState(0);

//   const token = localStorage.getItem("token");

//   /* =========================
//      TIMER
//   ========================= */
//   useEffect(() => {
//     if (timer === 0) return;

//     const interval = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   /* =========================
//      SEND OTP
//   ========================= */
//   const sendOTP = async () => {
//     try {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         "recaptcha-container",
//         { size: "invisible" },
//         auth
//       );

//       const result = await signInWithPhoneNumber(
//         auth,
//         "+91" + mobile,
//         window.recaptchaVerifier
//       );

//       setConfirmation(result);
//       setTimer(60);
//       alert("OTP sent successfully");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   /* =========================
//      VERIFY OTP
//   ========================= */
//   const verifyOTP = async () => {
//     try {
//       await confirmation.confirm(otp);

//       // 🔁 notify backend
//       await axios.post(
//         "http://localhost:5000/verify-mobile",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Mobile verified successfully");
//     } catch (err) {
//       alert("Invalid OTP");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Verify Mobile Number</h2>

//       <input
//         placeholder="Mobile number"
//         value={mobile}
//         onChange={(e) => setMobile(e.target.value)}
//         style={styles.input}
//       />

//       <button onClick={sendOTP} disabled={timer > 0} style={styles.btn}>
//         {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
//       </button>

//       {confirmation && (
//         <>
//           <input
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             style={styles.input}
//           />

//           <button onClick={verifyOTP} style={styles.verifyBtn}>
//             Verify OTP
//           </button>
//         </>
//       )}

//       <div id="recaptcha-container"></div>
//     </div>
//   );
// }

// /* =========================
//    STYLES
// ========================= */

// const styles = {
//   container: {
//     maxWidth: "400px",
//     margin: "100px auto",
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "8px",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "14px",
//   },
//   btn: {
//     padding: "10px",
//     background: "#1976d2",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
//   verifyBtn: {
//     padding: "10px",
//     background: "#2e7d32",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
// };

import { useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

export default function MobileVerification({ token, onVerified }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [timer, setTimer] = useState(0);

  /* =========================
     SEND OTP
  ========================= */
  const sendOTP = async () => {
    if (!mobile) return alert("Enter mobile number");

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );

    const result = await signInWithPhoneNumber(
      auth,
      "+91" + mobile,
      window.recaptchaVerifier
    );

    setConfirmation(result);
    startTimer();
    alert("OTP sent to mobile");
  };

  /* =========================
     VERIFY OTP
  ========================= */
  const verifyOTP = async () => {
    if (!otp) return;

    await confirmation.confirm(otp);

    // 🔐 Inform backend
    await axios.post(
      "http://localhost:5000/verify-otp",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Mobile verified");
    onVerified();
  };

  /* =========================
     RESEND TIMER
  ========================= */
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  return (
    <div style={styles.box}>
      <div id="recaptcha-container"></div>

      <input
        placeholder="Mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={styles.input}
      />

      <button onClick={sendOTP} disabled={timer > 0}>
        {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
      </button>

      {confirmation && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />

          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

const styles = {
  box: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    width: "160px",
  },
};