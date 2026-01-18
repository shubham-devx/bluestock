import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getAuth,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  /* =========================
     AUTH CHECK + PROFILE LOAD
  ========================= */
  useEffect(() => {
    if (!token) return;
    try {
      jwtDecode(token);
      fetchProfile();
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get("http://localhost:5000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  /* =========================
     EMAIL VERIFICATION
  ========================= */
  const refreshEmailStatus = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return alert("Firebase user not found");

    await firebaseUser.reload();

    if (firebaseUser.emailVerified) {
      await axios.post(
        "http://localhost:5000/verify-email",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Email verified");
      fetchProfile();
    } else {
      alert("Email still not verified");
    }
  };

  const resendVerificationEmail = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return alert("Firebase user not found");

    await sendEmailVerification(firebaseUser);
    alert("Verification email sent again");
  };

  /* =========================
     FIREBASE PHONE OTP
  ========================= */
  const sendOTP = async () => {
    try {
      setLoading(true);

      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${user.mobile_no}`,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setTimer(60);
      alert("OTP sent via SMS");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);

      await window.confirmationResult.confirm(otp);

      await axios.post(
        "http://localhost:5000/mobile-verified",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Mobile verified successfully");
      setOtp("");
      fetchProfile();
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OTP TIMER
  ========================= */
  useEffect(() => {
    if (timer === 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={styles.wrapper}>
      <div id="recaptcha-container"></div>

      <header style={styles.header}>
        <h2>Bluestock</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <div style={styles.container}>
        <h3>Welcome 👋</h3>

        <div style={styles.card}>
          <p><strong>Email</strong></p>
          <p>{user.email}</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h4>Email Status</h4>
            <span style={user.is_email_verified ? styles.ok : styles.pending}>
              {user.is_email_verified ? "Verified" : "Not Verified"}
            </span>

            {!user.is_email_verified && (
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button onClick={refreshEmailStatus} style={styles.secondaryBtn}>
                  Refresh
                </button>
                <button onClick={resendVerificationEmail} style={styles.primaryBtn}>
                  Resend
                </button>
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h4>Mobile Status</h4>
            <span style={user.is_mobile_verified ? styles.ok : styles.pending}>
              {user.is_mobile_verified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        {!user.is_mobile_verified && (
          <div style={styles.card}>
            <h4>Verify Mobile</h4>

            <div style={styles.otpRow}>
              <button
                onClick={sendOTP}
                disabled={timer > 0 || loading}
                style={styles.secondaryBtn}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
              </button>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                style={styles.otpInput}
              />

              <button
                onClick={verifyOTP}
                disabled={!otp || loading}
                style={styles.primaryBtn}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/company")}
        >
          Company Profile
        </button>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  wrapper: { minHeight: "100vh", background: "#f4f6f8" },
  header: {
    background: "#1976d2",
    color: "#fff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
  },
  logoutBtn: {
    background: "#e53935",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
  },
  container: { maxWidth: 900, margin: "30px auto", padding: "0 20px" },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: 20,
  },
  ok: {
    background: "#e6f4ea",
    color: "#2e7d32",
    padding: "6px 14px",
    borderRadius: 20,
    fontWeight: "bold",
  },
  pending: {
    background: "#fdecea",
    color: "#c62828",
    padding: "6px 14px",
    borderRadius: 20,
    fontWeight: "bold",
  },
  otpRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  otpInput: { padding: 10, width: 120 },
  primaryBtn: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 6,
    fontWeight: "bold",
  },
  secondaryBtn: {
    background: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 6,
  },
};



