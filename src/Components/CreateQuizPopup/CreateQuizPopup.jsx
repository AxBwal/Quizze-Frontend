import React, { useState } from 'react';
import styles from './CreateQuizPopup.module.css';
import Poll from '../../Components/Poll/Poll';
import QandA from '../../Components/QandA/QandA';
import toast from 'react-hot-toast';

function CreateQuizPopup({ onClose }) {
  const [quizType, setQuizType] = useState('Q&A');
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [quizName, setQuizName] = useState('');

  const handleTypeChange = (type) => {
    setQuizType(type);
  };

  const handleContinue = () => {
    if (quizName.trim() === '') {
      toast.error('Quiz name is required');
      return;
    }

    if (quizType === 'Poll Type' || quizType === 'Q&A') {
      setIsCreatingQuiz(true);
    } else {
      alert('Other quiz types are not yet implemented.');
    }
  };

  const handleQuizClose = () => {
    setIsCreatingQuiz(false);
    onClose();
  };

  return (
    <div className={styles.popupOverlay}>
      {!isCreatingQuiz ? (
        <div className={styles.popupContent}>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Quiz Name" 
              value={quizName} 
              onChange={(e) => setQuizName(e.target.value)} 
            />
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
        quizType === 'Poll Type' ? (
          <Poll onClose={handleQuizClose} />
        ) : (
          <QandA onClose={handleQuizClose} />
        )
      )}
    </div>
  );
}

export default CreateQuizPopup;
