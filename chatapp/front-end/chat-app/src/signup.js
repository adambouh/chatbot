import React, { useState } from 'react';
import backendUrl from './url'; // Ensure this contains your backend base URL

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Call the backend add user endpoint
      const response = await fetch(backendUrl + '/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Sending the user data (username and password)
      });

      if (response.ok) {
        alert('Signup successful! Please login.');
        window.location.href = '/login'; // Redirect to login after successful signup
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={styles.signupContainer}>
      <div style={styles.signupForm}>
        <h1 style={styles.heading}>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.signupButton}>Sign Up</button>
        </form>
        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e0e7ff',
  },
  signupForm: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    width: '320px',
  },
  heading: {
    marginBottom: '25px',
    fontSize: '24px',
    color: '#4f46e5',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '8px',
    color: '#6b7280',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  signupButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorMessage: {
    color: '#d9534f',
    padding: '10px',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default Signup;
    