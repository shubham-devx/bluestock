import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>

      {user ? (
        <div style={styles.card}>
          <p><b>User ID:</b> {user.userId}</p>
          <p><b>Email:</b> {user.email}</p>
          <p>
            <b>Token expires at:</b>{" "}
            {new Date(user.exp * 1000).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No user data</p>
      )}

      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#f9f9f9",
  },
  button: {
    padding: "10px 20px",
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
