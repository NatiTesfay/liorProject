// components/screens/LoginPage/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Login successful!');
        localStorage.setItem('token', data.token); // Store the JWT in localStorage
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to the dashboard
        }, 2000); // Wait 2 seconds before redirecting
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  return (
    <div className='container-center'>
      <div className='container'>
        <div className='login-card'>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='username'>Username:</label>
              <input
                type='text'
                id='username'
                name='username'
                placeholder='Enter your username'
                required
                onChange={handleChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password:</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your password'
                required
                onChange={handleChange}
              />
            </div>
            <button type='submit'>Login</button>
          </form>
          <div className='footer'>
            <p>
              Don't have an account? <a href='/register'>Register</a>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
