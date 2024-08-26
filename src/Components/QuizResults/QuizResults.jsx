import React from 'react';
import styles from './QuizResults.module.css'; 
import congrats from "../../assets/congrats.png"

function QuizResults({ correctAnswers, totalQuestions }) {
  return (
    <div className={styles.resultsContainer}>
      <h2>Congrats Quiz is completed</h2>
      <div className={styles.trophyContainer}>
        <img src={congrats} alt="Trophy" className={styles.trophy} /> {/* Add your trophy image */}
      </div>
      <p className={styles.scoreText}>
        Your Score is <span className={styles.score}>{correctAnswers}/{totalQuestions}</span>
      </p>
    </div>
  );
}

export default QuizResults;
