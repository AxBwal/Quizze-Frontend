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
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`https://quizze-backend-anshumanakhilnew.vercel.app/quiz/${uniqueUrl}`);
        setQuizData(response.data);
        const initialTime = response.data.questions[0].timer !== "OFF" ? parseInt(response.data.questions[0].timer, 10) : null;
        setTimeLeft(initialTime);
      } catch (error) {
        console.error('Failed to load quiz:', error);
      }
    };

    fetchQuizData();
  }, [uniqueUrl]);

  useEffect(() => {
    if (timeLeft !== null) {
      if (timeLeft === 0) {
        handleNext();
      } else {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeLeft]);

  const getTimerClass = () => {
    if (timeLeft !== null && timeLeft <= 10) { // Change the threshold as needed
      return styles.timerRed;
    }
    return '';
  };

  const handleNext = () => {
    if (!quizData || !quizData.questions) return;

    if (selectedOption !== null) {
      const isCorrect = quizData.questions[currentQuestion].options[selectedOption].isCorrect;
      saveResponse(isCorrect);

      if (isCorrect) {
        setCorrectAnswers(prevCount => {
          const newCount = prevCount + 1;
          console.log(`Correct answer selected! New correct answer count: ${newCount}`);
          return newCount;
        });
      }
    }

    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      const nextTime = quizData.questions[currentQuestion + 1].timer !== "OFF" ? parseInt(quizData.questions[currentQuestion + 1].timer, 10) : null;
      setTimeLeft(nextTime);
    } else {
      setQuizCompleted(true);
    }
  };

  const saveResponse = async (isCorrect) => {
    if (!quizData || !quizData.questions) return;

    const responseData = {
      uniqueUrl,
      questionId: quizData.questions[currentQuestion]._id,
      isCorrect: isCorrect,
    };

    try {
      const response = await axios.post('https://quizze-backend-anshumanakhilnew.vercel.app/quiz/response', responseData);
      if (response.status === 200) {
        console.log('Response successfully submitted');
      } else {
        console.error('Failed to submit quiz response:', response.data);
      }
    } catch (error) {
      console.error('Failed to submit quiz response:', error);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!quizData) return <div>Loading...</div>;

  if (quizCompleted) {
    return <QuizResults correctAnswers={correctAnswers} totalQuestions={quizData.questions.length} />;
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <span>{`0${currentQuestion + 1}/0${quizData.questions.length}`}</span>
        {timeLeft !== null && (
          <span className={getTimerClass()}>
            {formatTime(timeLeft)}
          </span>
        )}
      </div>
      <div className={styles.quizQuestion}>
        {quizData.questions[currentQuestion]?.text}
      </div>
      <div className={styles.quizOptions}>
        {quizData.questions[currentQuestion]?.options?.map((option, index) => (
          <div
            key={index}
            className={`${styles.quizOption} ${selectedOption === index ? styles.selected : ''}`}
            onClick={() => setSelectedOption(index)}
          >
            {quizData.questions[currentQuestion]?.selectedType === 'TextImage' ? (
              <div className={styles.textImageContainer}>
                <span className={styles.optionText}>{option.text}</span>
                <img src={option.image} alt={`Option ${index + 1}`} className={styles.quizImage} />
              </div>
            ) : quizData.questions[currentQuestion]?.selectedType === 'Image' ? (
              <img src={option.value} alt={`Option ${index + 1}`} className={styles.quizImage} />
            ) : (
              <span className={styles.optionText}>{option.value}</span>
            )}
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
