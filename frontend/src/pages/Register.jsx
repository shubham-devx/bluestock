import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    mobile: "",
    countryCode: "+91",
    dob: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      // 🔹 Firebase create user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 🔹 Send verification email
      await sendEmailVerification(userCred.user);

      alert(
        "Verification email sent. Please verify your email before login."
      );

      // 🔹 Move to login (OTP step can be added next)
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        {/* LEFT */}
        <div className="register-left">
          <h2>Join Bluestock</h2>
          <p>Hire smarter. Grow faster.</p>
        </div>

        {/* RIGHT */}
        <div className="register-right">
          <h2>Register as a Company</h2>

          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />

            <label>Mobile No</label>
            <div className="mobile-row">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                name="mobile"
                placeholder="Mobile number"
                onChange={handleChange}
                required
              />
            </div>

            <label>Organization Email</label>
            <input
              type="email"
              name="email"
              placeholder="Official email"
              onChange={handleChange}
              required
            />

            <label>Gender</label>
            <div className="gender-row">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  type="button"
                  key={g}
                  className={form.gender === g ? "active" : ""}
                  onClick={() => setForm({ ...form, gender: g })}
                >
                  {g}
                </button>
              ))}
            </div>

            <label>Date of Birth</label>
            <input type="date" name="dob" onChange={handleChange} />

            <div className="password-row">
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" required />
              <span>
                I agree to the <b>Privacy Policy</b> & <b>Terms of Use</b>
              </span>
            </div>

            <button disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="login-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}