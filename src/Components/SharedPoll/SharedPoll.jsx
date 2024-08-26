// SharedPoll.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPoll, submitPollResponse } from '../../api/createPoll';
import PollResults from '../PollResults/PollResults';
import styles from './SharedPoll.module.css';

function SharedPoll() {
  const { uniqueUrl } = useParams();
  const [pollData, setPollData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollCompleted, setPollCompleted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        console.log('Attempting to load poll:', uniqueUrl);
        const data = await getPoll(uniqueUrl);
        console.log('Poll data fetched:', data);
        setPollData(data);
      } catch (error) {
        console.error('Failed to load poll:', error);
      }
    };

    fetchPoll();
  }, [uniqueUrl]);

  const handleNext = () => {
    if (!pollData || !pollData.questions) return;

    if (selectedOption !== null) {
      saveResponse();
    }
    if (currentQuestion + 1 < pollData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setPollCompleted(true);
    }
  };

  const saveResponse = async () => {
    if (!pollData || !pollData.questions) return;
  
    const responseData = {
      uniqueUrl,
      questionId: pollData.questions[currentQuestion]._id, // Ensure you're using the question's correct ID
      selectedOption: pollData.questions[currentQuestion].options[selectedOption].value, // or 'text'/'image' based on the type
    };
  
    try {
      await submitPollResponse(responseData);
      console.log('Response submitted successfully');
    } catch (error) {
      console.error('Failed to submit poll response:', error);
    }
  };
  

  if (!pollData) return <div>Loading...</div>;

  if (pollCompleted) {
    return <PollResults />;
  }

  return (
    <div className={styles.pollContainer}>
      <div className={styles.pollHeader}>
        <span>{`0${currentQuestion + 1}/0${pollData.questions.length}`}</span>
      </div>
      <div className={styles.pollQuestion}>
        {pollData.questions[currentQuestion].text}
      </div>
      <div className={styles.pollOptions}>
        {pollData.questions[currentQuestion].options.map((option, index) => (
          <div
            key={index}
            className={`${styles.pollOption} ${selectedOption === index ? styles.selected : ''}`}
            onClick={() => setSelectedOption(index)}
          >
            {option.value || option.image}
          </div>
        ))}
      </div>
      <button className={styles.pollNextButton} onClick={handleNext}>
        {currentQuestion + 1 < pollData.questions.length ? 'NEXT' : 'SUBMIT'}
      </button>
    </div>
  );
}

export default SharedPoll;
