import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuEye } from 'react-icons/lu';
import styles from './Dashboard.module.css';
import CreateQuizPopup from '../../Components/CreateQuizPopup/CreateQuizPopup';

function Dashboard({ handleLogout }) {
  const [showPopup, setShowPopup] = useState(false);
  const [trendingItems, setTrendingItems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://localhost:3000/quiz/analytics/${localStorage.getItem('user')}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredItems = response.data
          .filter(item => item.impressions >= 10)
         

        setTrendingItems(filteredItems);
      } catch (err) {
        console.error('Failed to fetch trending items', err);
        setError('Failed to load trending items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  const logoutHandler = () => {
    handleLogout();
    navigate('/signin');
  };

  const goToAnalytics = () => {
    const userId = localStorage.getItem('user');
    navigate(`/analytics/${userId}`);
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
          <li className={styles.active}>Dashboard</li>
          <li onClick={goToAnalytics}>Analytics</li>
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
            <div className={styles.cardCount}>0</div>
            <div className={styles.cardLabel}>Quizzes Created</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardCount}>0</div>
            <div className={styles.cardLabel}>Questions Created</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardCount}>0</div>
            <div className={styles.cardLabel}>Total Impressions</div>
          </div>
        </div>

        <h2 className={styles.trendingHeading}>Trending Quizzes</h2>

        {loading ? (
          <p>Loading trending items...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : trendingItems.length === 0 ? (
          <p>No trending quizzes or polls to show.</p>
        ) : (
          <div className={styles.trendingItemsContainer}>
            {trendingItems.map((item, index) => (
              <div key={item._id} className={styles.trendingItem}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>
                    {item.title || `Quiz ${index + 1}`}
                  </span>
                  <span className={styles.impressions}>
                    {item.impressions}{' '}
                    <LuEye size={20} color="#FF5D01" />
                  </span>
                </div>
                <span className={styles.itemDate}>
                  Created on:{' '}
                  {new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {showPopup && <CreateQuizPopup onClose={closePopup} />}
    </div>
  );
}

export default Dashboard;
