import React, { useState } from 'react';
import styles from './CreateQuizPopup.module.css';
import QandA from '../../Components/QandA/QandA';

function CreateQuizPopup({ onClose }) {
  const [quizType, setQuizType] = useState('Q&A'); // Default selected type
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false); // Manage the state to show QandA component

  const handleTypeChange = (type) => {
    setQuizType(type);
  };

  const handleContinue = () => {
    if (quizType === 'Q&A') {
      setIsCreatingQuiz(true); // If Q&A is selected, show the QandA component
    } else {
      // Handle other quiz types if needed
      alert('Other quiz types are not yet implemented.');
    }
  };

  const handleQuizClose = () => {
    setIsCreatingQuiz(false); // Reset to go back to the quiz type selection
    onClose(); // Close the popup entirely if desired
  };

  return (
    <div className={styles.popupOverlay}>
      {!isCreatingQuiz ? (
        <div className={styles.popupContent}>
          <div className={styles.formGroup}>
            <input type="text" placeholder="Quiz Name" />
          </div>
          <div className={styles.formGroup}>
            <label>Quiz Type</label>
            <div className={styles.toggleButtons}>
              <button
                className={quizType === 'Q&A' ? styles.selected : ''}
                onClick={() => handleTypeChange('Q&A')}
              >
                Q & A
              </button>
              <button
                className={quizType === 'Poll Type' ? styles.selected : ''}
                onClick={() => handleTypeChange('Poll Type')}
              >
                Poll
              </button>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={onClose}>Cancel</button>
            <button className={styles.continueButton} onClick={handleContinue}>Continue</button>
          </div>
        </div>
      ) : (
        <QandA onClose={handleQuizClose} />
      )}
    </div>
  );
}

export default CreateQuizPopup;
