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

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/${uniqueUrl}`);
        console.log('Quiz data:', response.data); // Log the fetched data
        setQuizData(response.data);
      } catch (error) {
        console.error('Failed to load quiz:', error);
      }
    };

    fetchQuizData();
  }, [uniqueUrl]);

  const handleNext = () => {
    if (!quizData || !quizData.questions) return;

    if (selectedOption !== null) {
      saveResponse();
    }
    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const saveResponse = async () => {
    if (!quizData || !quizData.questions) return;

    const responseData = {
      uniqueUrl,
      questionId: quizData.questions[currentQuestion]._id,
      selectedOption: quizData.questions[currentQuestion].options[selectedOption].value,
    };

    try {
      await axios.post('http://localhost:3000/quiz/response', responseData);
      console.log('Response submitted successfully');
    } catch (error) {
      console.error('Failed to submit quiz response:', error);
    }
  };

  if (!quizData) return <div>Loading...</div>;

  if (quizCompleted) {
    return <QuizResults correctAnswers={correctAnswers} totalQuestions={quizData.questions.length} />;
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <span>{`0${currentQuestion + 1}/0${quizData.questions.length}`}</span>
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
            {/* Render the value for text-based options */}
            {option.value || <img src={option.image} alt={`Option ${index + 1}`} />}
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
