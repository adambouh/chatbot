import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import backendUrl from './url';
import checkSession from './session';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      console.log('Form submitted');

      const response = await fetch(backendUrl + '/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.jwt;

        localStorage.setItem('token', token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data.id);

        alert('Login successful');
        window.location.href = '/';
      } else {
        setError("Username or Password are incorrect");
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const isValid = await checkSession();
      if (isValid) {
        window.location.href = '/';
      }
    };
    checkUserSession();
  }, []);

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginForm}>
        <h1 style={styles.heading}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username or Email</label>
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
          <button type="submit" style={styles.loginButton}>Login</button>
        </form>
        {error && <p style={styles.errorMessage}>{error}</p>}

        {/* Add signup link */}
        <p style={styles.signupText}>
          Don't have an account? <Link to="/signup" style={styles.signupLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e0e7ff',
  },
  loginForm: {
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
  loginButton: {
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
  signupText: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#6b7280',
  },
  signupLink: {
    color: '#4f46e5',
    textDecoration: 'none',
  },
};

export default Login;
