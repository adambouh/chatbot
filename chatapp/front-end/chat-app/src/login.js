import React, { useState, useEffect } from 'react';
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
      console.log('Form submitted'); // Add this to check if the function is triggered

      // Print the backend URL before fetching
      console.log('Backend URL:', backendUrl + '/user/login');

      const response = await fetch(backendUrl + '/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include', // This ensures cookies are sent and stored
      });

      if (response.ok) {

        const data = await response.json();
        console.log(data); // Assuming backend returns JSON with token
        const token = data.jwt; // Adjust this to match your backend's response structure

        // Store the JWT in local storage or cookies
        localStorage.setItem('token', token);
        localStorage.setItem('username',data.username);
        localStorage.setItem('id',data.id);

        alert('Login successful');
        window.location.href = '/'; // Redirect after successful login
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
    // Function to check the session status
    const checkUserSession = async () => {
      const isValid = await checkSession();
      if (isValid) {
        window.location.href = '/'; // Redirect if session is valid
      }else{
      }
    };
    checkUserSession(); // Run session check on component mount
  }, []); // Empty dependency array to run only on component mount

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
  loginButtonHover: {
    backgroundColor: '#4338ca',
  },
  errorMessage: {
    color: '#d9534f',
    padding: '10px',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default Login;
