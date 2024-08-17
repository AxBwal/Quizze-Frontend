import React, { useState } from 'react';
import { Register } from '../../api/User';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './Signup.module.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setErrors({
      ...errors,
      [event.target.name]: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Invalid name';
    if (!formData.email) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.email !== formData.email.toLowerCase()) {
      toast.error('Email should be in lowercase');
      newErrors.email = 'Email should be in lowercase';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const responseData = await Register(
        formData.username,
        formData.email.toLowerCase(),
        formData.password,
        formData.confirmPassword
      );
      if (responseData.success) {
        toast.success(responseData.message || 'User registered successfully!');
        setTimeout(() => navigate('/signin'), 1500);
      } else {
        toast.error(responseData.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during signup');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={`${styles.heading} jomhuria-regular`}>QUIZZIE</div>
        <div className={`${styles.toggleContainer} poppins-thin`}>
          <span
            className={`${styles.toggleOption} ${styles.active}`}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
          <span
            className={styles.toggleOption}
            onClick={() => navigate('/signin')}
          >
            Log In
          </span>
        </div>
        <form onSubmit={handleSubmit} className="poppins-thin">
          <div className={`${styles.inputGroup} ${errors.username ? styles.inputGroupError : ''}`}>
            <label className={styles.label} htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? styles.errorInput : ''}
              placeholder={errors.username || 'Enter your name'}
            />
          </div>
          <div className={`${styles.inputGroup} ${errors.email ? styles.inputGroupError : ''}`}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
              placeholder={errors.email || 'Enter your email'}
            />
          </div>
          <div className={`${styles.inputGroup} ${errors.password ? styles.inputGroupError : ''}`}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
              placeholder={errors.password || '***********'}
            />
          </div>
          <div className={`${styles.inputGroup} ${errors.confirmPassword ? styles.inputGroupError : ''}`}>
            <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.errorInput : ''}
              placeholder={errors.confirmPassword || '***********'}
            />
          </div>
          <div>
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
