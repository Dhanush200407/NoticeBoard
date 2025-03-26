import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate(); // For navigation after successful login

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user ID and name in localStorage after successful login
        if (!isSignUp) {
          localStorage.setItem('userId', data.user.id); // Assuming the backend sends the user ID in the response
          localStorage.setItem('userName', data.user.name); // Assuming the backend sends the user name in the response
        }

        alert(data.message);

        if (!isSignUp) {
          navigate('/notice-board'); // Redirect after successful login
        } else {
          setIsSignUp(false); // Switch to login after signup
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Separated Header */}
      <header className="login-header1">
        <h1 className="login-title1">Notice Board</h1>
      </header>

      {/* Centered Form */}
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-heading">{isSignUp ? "Sign Up" : "Login"}</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="login-input"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="login-input"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="login-input"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="login-button">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <p className="login-toggle-text">
            {isSignUp ? "Already registered? " : "Not signed up? "}
            <span onClick={() => setIsSignUp(!isSignUp)} className="login-toggle-link">
              {isSignUp ? "Login now" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;