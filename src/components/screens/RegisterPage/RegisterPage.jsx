import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterPage.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Wait 3 seconds before redirecting
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className='container-center'>
      <div className='container'>
        <div className='title'>Registration</div>
        <div className='content'>
          {error && <div className='error-message'>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className='user-details'>
              <div className='input-box'>
                <span className='details'>Full Name</span>
                <input
                  type='text'
                  name='fullName'
                  placeholder='Enter your name'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Username</span>
                <input
                  type='text'
                  name='username'
                  placeholder='Enter your username'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Email</span>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Phone Number</span>
                <input
                  type='text'
                  name='phoneNumber'
                  placeholder='Enter your number'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Country</span>
                <input
                  type='text'
                  name='country'
                  placeholder='Enter your country'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>City</span>
                <input
                  type='text'
                  name='city'
                  placeholder='Enter your city'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Password</span>
                <input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Confirm Password</span>
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm your password'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='input-box'>
                <span className='details'>Gender</span>
                <select name='gender' required onChange={handleChange}>
                  <option value='' disabled selected hidden>
                    Select your gender
                  </option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='preferNotToSay'>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div className='button'>
              <input type='submit' value='Register' />
            </div>
            <div className='login-link'>
              Already have an account? <a href='/login'>Login here</a>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default RegistrationForm;
