import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './QuizQuestionAnalysisPage.module.css';

function QuizQuestionAnalysisPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/id/${quizId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setQuizData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>QUIZZIE</div>
        <ul className={styles.navList}>
          <li onClick={() => navigate(`/dashboard/${quizData.userId}`)}>Dashboard</li>
          <li className={styles.active}>Analytics</li>
          <li onClick={() => navigate(`/quiz/create`)}>Create Quiz</li>
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
          <h2 className={styles.title}>Quiz {quizData.title} Question Analysis</h2>
          <div className={styles.dateInfo}>
            <p>Created on: {new Date(quizData.createdAt).toLocaleDateString()}</p>
            <p>Impressions: {quizData.impressions}</p>
          </div>
        </div>

        {quizData.questions.map((question, index) => (
          <div key={index} className={styles.questionCard}>
            <h3>Q{index + 1}: {question.text}</h3>
            <div className={styles.statsContainer}>
              <div>
                <h4>{quizData.totalAttempts}</h4> {/* Display total attempts */}
                <p>people Attempted the question</p>
              </div>
              <div>
                <h4>{quizData.correctResponses}</h4> {/* Display correct responses */}
                <p>people Answered Correctly</p>
              </div>
              <div>
                <h4>{quizData.incorrectResponses}</h4> {/* Display incorrect responses */}
                <p>people Answered Incorrectly</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizQuestionAnalysisPage;
