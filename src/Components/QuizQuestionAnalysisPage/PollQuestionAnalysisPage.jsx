import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../QuizQuestionAnalysisPage/QuizQuestionAnalysisPage.module.css'; 

function PollQuestionAnalysisPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await axios.get(`https://quizze-backend-anshumanakhilnew.vercel.app/poll/id/${pollId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPollData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [pollId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>QUIZZIE</div>
        <ul className={styles.navList}>
          <li onClick={() => navigate(`/dashboard/${pollData.userId}`)}>Dashboard</li>
          <li className={styles.active}>Analytics</li>
          <li onClick={() => navigate(-1)}>Create Quiz</li>
        </ul>
        <div className={styles.logoutSection}>
          <hr className={styles.divider} />
          <button onClick={() => navigate('/signin')} className={styles.logoutButton}>
            LOGOUT
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>Poll {pollData.title} Question Analysis</h2>
          <div className={styles.dateInfo}>
            <p>Created on: {new Date(pollData.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}</p>
            <p>Impressions: {pollData.impressions}</p>
          </div>
        </div>

        {pollData.questions.map((question, index) => (
          <div key={index} className={styles.questionCard}>
            <h3>Q{index + 1}: {question.text}</h3>
            <div className={styles.statsContainer}>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className={styles.optionBox}>
                  <h4>{option.count}</h4> {/* Display count of selections */}
                  <p>{option.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PollQuestionAnalysisPage;
