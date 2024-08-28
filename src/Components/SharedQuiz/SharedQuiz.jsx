import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizResults from '../QuizResults/QuizResults';
import styles from '../SharedQuiz/SharedQuiz.module.css';

function SharedQuiz() {
  const { uniqueUrl } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/${uniqueUrl}`);
        setQuizData(response.data);

        // Start the timer for the first question
        startTimer(response.data.questions[0].timer);

        // Increment the impressions count
        await axios.post(`http://localhost:3000/quiz/impressions`, { uniqueUrl });

      } catch (error) {
        console.error('Failed to load quiz:', error);
      }
    };

    fetchQuizData();
  }, [uniqueUrl]);

  const startTimer = (time) => {
    if (time !== 'OFF') {
      setTimer(parseInt(time, 10));
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(countdown);
            handleNext(); // Automatically move to the next question when time runs out
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}s`;
  };

  const handleNext = () => {
    if (!quizData || !quizData.questions) return;

    if (selectedOption !== null) {
      saveResponse();
    }
    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      startTimer(quizData.questions[currentQuestion + 1].timer);
    } else {
      setQuizCompleted(true);
    }
  };

  const saveResponse = () => {
    if (!quizData || !quizData.questions) return;

    const isCorrect = quizData.questions[currentQuestion].options[selectedOption]?.isCorrect || false;
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    axios.post('http://localhost:3000/quiz/response', {
      uniqueUrl,
      questionId: quizData.questions[currentQuestion]._id,
      isCorrect,
    }).catch(error => {
      console.error('Failed to save response:', error);
    });
  };

  if (!quizData) return <div>Loading...</div>;

  if (quizCompleted) {
    return <QuizResults correctAnswers={correctAnswers} totalQuestions={quizData.questions.length} />;
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <span>{`0${currentQuestion + 1}/0${quizData.questions.length}`}</span>
        <span className={styles.quizTimer}>{timer > 0 ? formatTime(timer) : '00:00s'}</span>
      </div>
      <div className={styles.quizQuestion}>
        {quizData.questions[currentQuestion].text}
      </div>
      <div className={styles.quizOptions}>
        {quizData.questions[currentQuestion].options.map((option, index) => (
          <div
            key={index}
            className={`${styles.quizOption} ${selectedOption === index ? styles.selected : ''}`}
            onClick={() => setSelectedOption(index)}
          >
            {option.value || option.image}
          </div>
        ))}
      </div>
      <button className={styles.quizNextButton} onClick={handleNext}>
        {currentQuestion + 1 < quizData.questions.length ? 'NEXT' : 'SUBMIT'}
      </button>
    </div>
  );
}

export default SharedQuiz;
