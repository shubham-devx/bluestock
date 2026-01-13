import { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    company_name: "",
    website: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch company profile
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("http://localhost:5000/company/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCompany(res.data);
        setIsEdit(true);
      } catch (err) {
        // If no company exists, backend should return 404
        setIsEdit(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [token]);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (isEdit) {
      await axios.put(
        "http://localhost:5000/company/profile",
        company,
        config
      );
      alert("Company profile updated");
    } else {
      await axios.post(
        "http://localhost:5000/company/profile",
        company,
        config
      );
      alert("Company profile created");
      setIsEdit(true);
    }
  } catch (err) {
    console.error("Company API error:", err.response || err.message);
    alert(
      err.response?.data?.message ||
      "Failed to create/update company profile"
    );
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>{isEdit ? "Edit Company Profile" : "Create Company Profile"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="company_name"
          placeholder="Company Name"
          value={company.company_name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="website"
          placeholder="Website"
          value={company.website}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={company.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button style={styles.button}>
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
  },
  textarea: {
    padding: "10px",
    minHeight: "80px",
  },
  button: {
    padding: "10px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
