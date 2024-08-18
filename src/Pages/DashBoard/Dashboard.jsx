import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import CreateQuizPopup from '../../Components/CreateQuizPopup/CreateQuizPopup';

function Dashboard({ handleLogout }) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    handleLogout();
    navigate('/signin');
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>QUIZZIE</div>
        <ul className={styles.navList}>
          <li>Dashboard</li>
          <li>Analytics</li>
          <li onClick={openPopup}>Create Quiz</li>
        </ul>
        <div className={styles.logoutSection}>
          <hr className={styles.divider} />
          <button onClick={logoutHandler} className={styles.logoutButton}>
            LOGOUT
          </button>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardCount} style={{ color: '#ff5722' }}>0</div>
            <div className={styles.cardLabel}>Quiz created</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardCount} style={{ color: '#4caf50' }}>0</div>
            <div className={styles.cardLabel}>Questions created</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardCount} style={{ color: '#2196f3' }}>0</div>
            <div className={styles.cardLabel}>Total Impressions</div>
          </div>
        </div>
        <h2 className={styles.trendingHeading}>Trending Quizzes</h2>
      </div>
      {showPopup && <CreateQuizPopup onClose={closePopup} />}
    </div>
  );
}

export default Dashboard;
