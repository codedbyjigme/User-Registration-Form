import React, { useState } from "react";
import "./App.css";

// HARD-CODED for now (correct approach for debugging)
const API_BASE =
  "http://user-registration-jigme-env.eba-hkyeza2p.ap-southeast-2.elasticbeanstalk.com";

function App() {
  console.log("API BASE =", API_BASE);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("User registered successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error(err);
      alert("Backend error while registering user");
    }
  };

  const toggleUsers = async () => {
    try {
      if (showUsers) {
        setShowUsers(false);
        return;
      }

      console.log("Fetching users...");
      const res = await fetch(`${API_BASE}/api/users`);

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      console.log("Users:", data);

      setUsers(data);
      setShowUsers(true);
    } catch (err) {
      console.error(err);
      alert("Backend error while fetching users");
    }
  };

  return (
    <div className="app-container">
      <div className="stack">
        <div className="card">
          <h2>Create Account</h2>

          <form onSubmit={registerUser}>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button className="register-btn" type="submit">
              Register
            </button>
          </form>

          <button
            className="show-btn"
            type="button"
            onClick={toggleUsers}
          >
            {showUsers ? "Hide Registered Users" : "Show Registered Users"}
          </button>
        </div>

        {showUsers && (
          <div className="card users-card">
            <h2>Registered Users</h2>

            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
