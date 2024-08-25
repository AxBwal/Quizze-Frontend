import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { createQuiz } from '../../api/createQuiz'; // Adjust the import path as needed
import PublishSuccess from '../PublishSuccess/PublishSuccess'; // Import the new component
import styles from './QandA.module.css';

function QandA({ onClose }) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      options: {
        Text: [
          { value: '', isCorrect: false },
          { value: '', isCorrect: false }
        ],
        Image: [
          { value: '', isCorrect: false },
          { value: '', isCorrect: false }
        ],
        TextImage: [
          { text: '', image: '', isCorrect: false },
          { text: '', image: '', isCorrect: false }
        ]
      },
      selectedType: 'Text',
      timer: 'OFF',
    },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [uniqueUrl, setUniqueUrl] = useState('');

  const addQuestion = () => {
    if (questions.length < 5) {
      const initialOptions = {
        Text: [
          { value: '', isCorrect: false },
          { value: '', isCorrect: false }
        ],
        Image: [
          { value: '', isCorrect: false },
          { value: '', isCorrect: false }
        ],
        TextImage: [
          { text: '', image: '', isCorrect: false },
          { text: '', image: '', isCorrect: false }
        ]
      };
  
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          text: '',
          options: initialOptions,
          selectedType: 'Text',
          timer: 'OFF',
        },
      ]);
      setSelectedQuestion(questions.length + 1);
    } else {
      toast.error('Maximum question limit reached');
    }
  };

  const removeQuestion = (questionId) => {
    if (questionId !== 1) {
      const updatedQuestions = questions.filter((question) => question.id !== questionId);
      setQuestions(updatedQuestions);
      setSelectedQuestion(updatedQuestions.length > 0 ? updatedQuestions[0].id : null);
    }
  };

  const addOption = (questionId) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: {
              ...question.options,
              [question.selectedType]: [
                ...question.options[question.selectedType],
                question.selectedType === 'TextImage'
                  ? { text: '', image: '', isCorrect: false }
                  : { value: '', isCorrect: false },
              ],
            },
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionId, optionIndex) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: {
              ...question.options,
              [question.selectedType]: question.options[question.selectedType].filter(
                (_, index) => index !== optionIndex
              ),
            },
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionTypeChange = (questionId, type) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId ? { ...question, selectedType: type } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionValueChange = (questionId, optionIndex, value, key = 'value') => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: {
              ...question.options,
              [question.selectedType]: question.options[question.selectedType].map((option, index) =>
                index === optionIndex
                  ? { ...option, [key]: value }
                  : option
              ),
            },
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionId, optionIndex) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: {
              ...question.options,
              [question.selectedType]: question.options[question.selectedType].map((option, index) => ({
                ...option,
                isCorrect: index === optionIndex,
              })),
            },
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleTimerChange = (questionId, timerValue) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId ? { ...question, timer: timerValue } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleCreateQuiz = async () => {
    try {
      const userId = localStorage.getItem('user');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }
  
      const formattedQuestions = questions.map((question) => ({
        text: question.text,
        selectedType: question.selectedType,
        timer: question.timer,
        options: question.options[question.selectedType],
      }));
  
      const quizData = {
        userId,
        questions: formattedQuestions,
      };
  
      const response = await createQuiz(quizData);
  
      // Log the response to debug
      console.log('Full response:', response);
  
      // Corrected access to uniqueUrl
      if (response && response.uniqueUrl) {
        const uniqueUrl = response.uniqueUrl;
        console.log('Unique URL:', uniqueUrl);
        setUniqueUrl(uniqueUrl);
        setShowPublishSuccess(true);
      } else {
        throw new Error('Unique URL not generated.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create quiz');
      console.error('Error during quiz creation:', error);
    }
  };
  
  
  
  
  
  

  return (
    <div>
      {showPublishSuccess ? (
        <PublishSuccess uniqueUrl={uniqueUrl} onClose={onClose} />
      ) : (
        <div className={styles.qandaContainer}>
          <div className={styles.header}>
            {questions.map((question) => (
              <div key={question.id} className={styles.questionItem}>
                <div
                  className={`${styles.questionNumber} ${
                    selectedQuestion === question.id ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedQuestion(question.id)}
                >
                  {question.id}
                </div>
                {question.id !== 1 && (
                  <button className={styles.removeButton} onClick={() => removeQuestion(question.id)}>
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            {questions.length < 5 && (
              <button className={styles.addButton} onClick={addQuestion}>
                +
              </button>
            )}
            <div className={styles.maxQuestionsText}>Max 5 questions</div>
          </div>

          <div className={styles.questionContent}>
            {questions.map(
              (question) =>
                question.id === selectedQuestion && (
                  <div key={question.id}>
                    <input
                      type="text"
                      placeholder="Quiz Question"
                      className={styles.questionInput}
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = questions.map((q) =>
                          q.id === question.id ? { ...q, text: e.target.value } : q
                        );
                        setQuestions(updatedQuestions);
                      }}
                    />

                    <div className={styles.optionTypes}>
                      <label>Option Types</label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${question.id}`}
                          onChange={() => handleOptionTypeChange(question.id, 'Text')}
                          checked={question.selectedType === 'Text'}
                        />
                        Text
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${question.id}`}
                          onChange={() => handleOptionTypeChange(question.id, 'Image')}
                          checked={question.selectedType === 'Image'}
                        />
                        Image URL
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${question.id}`}
                          onChange={() => handleOptionTypeChange(question.id, 'TextImage')}
                          checked={question.selectedType === 'TextImage'}
                        />
                        Text & Image URL
                      </label>
                    </div>

                    {question.options[question.selectedType].map((option, index) => (
                      <div
                        key={index}
                        className={`${styles.optionContainer} ${
                          option.isCorrect ? styles.correctOption : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correctOption-${question.id}`}
                          checked={option.isCorrect}
                          onChange={() => handleCorrectAnswerChange(question.id, index)}
                          className={styles.correctRadio}
                        />
                        {question.selectedType === 'TextImage' ? (
                          <>
                            <input
                              type="text"
                              placeholder="Text"
                              value={option.text}
                              className={styles.dualInput}
                              onChange={(e) =>
                                handleOptionValueChange(question.id, index, e.target.value, 'text')
                              }
                            />
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={option.image}
                              className={styles.dualInput}
                              onChange={(e) =>
                                handleOptionValueChange(question.id, index, e.target.value, 'image')
                              }
                            />
                          </>
                        ) : (
                          <input
                            type="text"
                            placeholder={question.selectedType === 'Text' ? 'Text' : 'Image URL'}
                            value={option.value}
                            onChange={(e) =>
                              handleOptionValueChange(
                                question.id,
                                index,
                                e.target.value
                              )
                            }
                            className={styles.optionInput}
                          />
                        )}
                        {index >= 2 && (
                          <button
                            className={styles.removeOptionButton}
                            onClick={() => removeOption(question.id, index)}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}

                    {question.options[question.selectedType].length < 4 && (
                      <button
                        className={styles.addOptionButton}
                        onClick={() => addOption(question.id)}
                      >
                        Add Option
                      </button>
                    )}

                    <div className={styles.timerSection}>
                      <label>Timer</label>
                      <div className={styles.timerOptions}>
                        <button
                          className={`${styles.timerButton} ${
                            question.timer === 'OFF' ? styles.selectedTimer : ''
                          }`}
                          onClick={() => handleTimerChange(question.id, 'OFF')}
                        >
                          OFF
                        </button>
                        <button
                          className={`${styles.timerButton} ${
                            question.timer === '5s' ? styles.selectedTimer : ''
                          }`}
                          onClick={() => handleTimerChange(question.id, '5s')}
                        >
                          5 sec
                        </button>
                        <button
                          className={`${styles.timerButton} ${
                            question.timer === '10s' ? styles.selectedTimer : ''
                          }`}
                          onClick={() => handleTimerChange(question.id, '10s')}
                        >
                          10 sec
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className={styles.footer}>
            <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button className={styles.createQuizButton} onClick={handleCreateQuiz}>Create Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QandA;
