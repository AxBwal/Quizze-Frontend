import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { createQuiz } from '../../api/createQuiz';
import PublishSuccess from '../PublishSuccess/PublishSuccess';
import styles from './QandA.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";

function QandA() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.item;

  const [questions, setQuestions] = useState(() => {
    if (quizData) {
      return quizData.questions.map((q, index) => ({
        id: index + 1,
        text: q.text,
        selectedType: q.selectedType,
        timer: q.timer,
        options: {
          Text: q.selectedType === 'Text' ? q.options : [],
          Image: q.selectedType === 'Image' ? q.options : [],
          TextImage: q.selectedType === 'TextImage' ? q.options : [],
        },
      }));
    } else {
      return [{
        id: 1,
        text: '',
        options: {
          Text: [
            { value: '', isCorrect: false },
            { value: '', isCorrect: false },
          ],
          Image: [
            { value: '', isCorrect: false },
            { value: '', isCorrect: false },
          ],
          TextImage: [
            { text: '', image: '', isCorrect: false },
            { text: '', image: '', isCorrect: false },
          ],
        },
        selectedType: 'Text',
        timer: 'OFF',
      }];
    }
  });

  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [uniqueUrl, setUniqueUrl] = useState(quizData?.uniqueId || '');
  const isEditing = !!quizData;

  const isValidImageUrl = (url) => {
    const imageUrlPattern = /\.(jpeg|jpg|gif|png|svg|webp)$/i;
    return imageUrlPattern.test(url);
  };

  const handleCreateOrUpdateQuiz = async () => {
    try {
      const userId = localStorage.getItem('user');
  
      if (!userId) {
        toast.error('User not logged in');
        return;
      }
  
      for (const question of questions) {
        if (!question.text.trim()) {
          toast.error(`Question ${question.id} text is required.`);
          return;
        }
  
        const selectedOptions = question.options[question.selectedType];
        if (selectedOptions.some(option => question.selectedType === 'TextImage'
          ? !option.text.trim() || !isValidImageUrl(option.image)
          : (question.selectedType === 'Image' && !isValidImageUrl(option.value)) || !option.value.trim())) {
          toast.error(`All options for Question ${question.id} are required and must be valid.`);
          return;
        }
  
        if (!selectedOptions.some(option => option.isCorrect)) {
          toast.error(`A correct answer must be selected for Question ${question.id}.`);
          return;
        }
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
        ...(isEditing && { uniqueId: uniqueUrl }),
      };
  
      // Log the quiz data before sending it to the backend
      console.log('Sending quiz data to backend:', quizData);
  
      const response = await createQuiz(quizData);
  
      if (response && response.uniqueUrl) {
        setUniqueUrl(response.uniqueUrl);
        setShowPublishSuccess(true);
      } else {
        throw new Error('Unique URL not generated.');
      }
    } catch (error) {
      console.log('Error in creating/updating quiz:', error);
      toast.error(error.message || 'Failed to create or update quiz');
    }
  };

  const handleCancel = () => {
    const userId = localStorage.getItem('user');
    if (userId) {
      navigate(`/analytics/${userId}`);
    } else {
      toast.error('User ID not found. Cannot redirect to analytics.');
    }
  };

  const addQuestion = () => {
    if (!isEditing && questions.length < 5) {
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
      toast.error('Maximum question limit reached or editing mode is on.');
    }
  };

  const removeQuestion = (questionId) => {
    if (!isEditing && questionId !== 1) {
      const updatedQuestions = questions.filter((question) => question.id !== questionId);
      setQuestions(updatedQuestions);
      setSelectedQuestion(updatedQuestions.length > 0 ? updatedQuestions[0].id : null);
    }
  };

  const addOption = (questionId) => {
    if (!isEditing) {
      const updatedQuestions = questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: {
                ...question.options,
                [question.selectedType]: [
                  ...question.options[question.selectedType],
                  question.selectedType === 'TextImage'
                    ? { text: '', image: '' }
                    : { value: '' },
                ],
              },
            }
          : question
      );
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (questionId, optionIndex) => {
    if (!isEditing) {
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
    }
  };

  const handleOptionTypeChange = (questionId, type) => {
    if (!isEditing) {
      const updatedQuestions = questions.map((question) =>
        question.id === questionId ? { ...question, selectedType: type } : question
      );
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionValueChange = (questionId, optionIndex, value, key = 'value') => {
    if (key === 'image' && !isValidImageUrl(value)) {
      toast.error('Only valid image URLs are allowed.');
      return;
    }

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
    if (!isEditing) {
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
    }
  };

  const handleTimerChange = (questionId, timerValue) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId ? { ...question, timer: timerValue } : question
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div>
      {showPublishSuccess ? (
        <PublishSuccess uniqueUrl={uniqueUrl} onClose={handleCancel} />
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
                {question.id !== 1 && !isEditing && (
                  <button className={styles.removeButton} onClick={() => removeQuestion(question.id)}>
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            {!isEditing && questions.length < 5 && (
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
                          disabled={isEditing}
                        />
                        Text
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${question.id}`}
                          onChange={() => handleOptionTypeChange(question.id, 'Image')}
                          checked={question.selectedType === 'Image'}
                          disabled={isEditing}
                        />
                        Image URL
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${question.id}`}
                          onChange={() => handleOptionTypeChange(question.id, 'TextImage')}
                          checked={question.selectedType === 'TextImage'}
                          disabled={isEditing}
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
                          disabled={isEditing}
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
                        {index >= 2 && !isEditing && (
                          <button
                            className={styles.removeOptionButton}
                            onClick={() => removeOption(question.id, index)}
                          >
                            <RiDeleteBin6Line size={"20px"} />
                          </button>
                        )}
                      </div>
                    ))}

                    {!isEditing && question.options[question.selectedType].length < 4 && (
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
            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
            <button className={styles.createQuizButton} onClick={handleCreateOrUpdateQuiz}>
              {isEditing ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QandA;
