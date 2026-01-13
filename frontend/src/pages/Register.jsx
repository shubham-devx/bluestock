import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // later API call
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
        />

        <button style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    width: 320,
    padding: 24,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
};
