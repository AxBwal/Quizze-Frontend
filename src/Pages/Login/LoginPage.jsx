import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { login } from '../../api/User';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage({ handleLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const responseData = await login(email, password);
      if (responseData.success) {
        toast.success(responseData.message);
        handleLogin();
        localStorage.setItem('token', responseData.token || '');
        localStorage.setItem('user', responseData.user || '');
        navigate(`/dashboard/${responseData.user}`);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during Login');
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.formContainer}>
      <div className={`${styles.heading} jomhuria-regular`}>QUIZZIE</div>
      <div className={`${styles.toggleContainer} poppins-thin`}>
        <span
          className={styles.toggleOption}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </span>
        <span
          className={`${styles.toggleOption} ${styles.active}`}
          onClick={() => navigate('/signin')}
        >
          Log In
        </span>
      </div>
      <form onSubmit={submitHandler} className="poppins-thin">
        <div className={`${styles.inputGroup} ${errors.email ? styles.inputGroupError : ''}`}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: '' }));
            }}
            type="email"
            value={email}
            placeholder={errors.email || 'Enter your email'}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
          />
        </div>
        <div className={`${styles.inputGroup} ${errors.password ? styles.inputGroupError : ''}`}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
            type="password"
            value={password}
            placeholder={errors.password || '***********'}
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
        </div>
        <div>
          <button type="submit" className={styles.button}>
            Log In
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default LoginPage;
