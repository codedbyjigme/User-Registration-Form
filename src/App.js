import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const API_BASE = process.env.REACT_APP_API_BASE_URL;


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

    await fetch(`${API_BASE}/api/users/register`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    });

    alert("User registered successfully");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const toggleUsers = async () => {
    if (showUsers) {
      setShowUsers(false);
      return;
    }

    const res = await fetch(`${API_BASE}/api/users`);
    const data = await res.json();
    setUsers(data);
    setShowUsers(true);
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

          <button className="show-btn" onClick={toggleUsers}>
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
                  <tr key={u.id}>
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
