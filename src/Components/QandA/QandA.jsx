import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './QandA.module.css';

function QandA({ onClose }) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      options: [
        { type: 'Text', value: { text: '' }, isCorrect: false },
        { type: 'Text', value: { text: '' }, isCorrect: false }
      ],
      timer: 'OFF'
    }
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [optionType, setOptionType] = useState('Text');

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          text: '',
          options: [
            { type: 'Text', value: { text: '' }, isCorrect: false },
            { type: 'Text', value: { text: '' }, isCorrect: false }
          ],
          timer: 'OFF'
        }
      ]);
      setSelectedQuestion(questions.length + 1);
      setOptionType('Text');
    } else {
      alert('Maximum question limit reached');
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
            options: [
              ...question.options,
              { type: optionType, value: { text: '', image: '' }, isCorrect: false }
            ]
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
            options: question.options.filter((_, index) => index !== optionIndex)
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionTypeChange = (questionId, type) => {
    setOptionType(type);
  };

  const handleOptionValueChange = (questionId, optionIndex, value, key) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: question.options.map((option, index) =>
              index === optionIndex
                ? { ...option, value: { ...option.value, [key]: value } }
                : option
            )
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
            options: question.options.map((option, index) => ({
              ...option,
              isCorrect: index === optionIndex
            }))
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

  return (
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
                      checked={optionType === 'Text'}
                    />
                    Text
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`optionType-${question.id}`}
                      onChange={() => handleOptionTypeChange(question.id, 'Image')}
                      checked={optionType === 'Image'}
                    />
                    Image URL
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`optionType-${question.id}`}
                      onChange={() => handleOptionTypeChange(question.id, 'TextImage')}
                      checked={optionType === 'TextImage'}
                    />
                    Text & Image URL
                  </label>
                </div>

                {question.options.map((option, index) => (
                  <div key={index} className={styles.optionContainer}>
                    <input
                      type="radio"
                      name={`correctOption-${question.id}`}
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswerChange(question.id, index)}
                      className={styles.correctRadio}
                    />
                    {option.type === 'TextImage' ? (
                      <>
                        <input
                          type="text"
                          placeholder="Text"
                          value={option.value.text || ''}
                          className={styles.dualInput}
                          onChange={(e) =>
                            handleOptionValueChange(question.id, index, e.target.value, 'text')
                          }
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={option.value.image || ''}
                          className={styles.dualInput}
                          onChange={(e) =>
                            handleOptionValueChange(question.id, index, e.target.value, 'image')
                          }
                        />
                      </>
                    ) : (
                      <input
                        type="text"
                        placeholder={option.type === 'Text' ? 'Text' : 'Image URL'}
                        value={option.type === 'Text' ? option.value.text : option.value.image}
                        onChange={(e) => handleOptionValueChange(question.id, index, e.target.value, option.type === 'Text' ? 'text' : 'image')}
                        className={styles.optionInput}
                      />
                    )}
                    {index >= 2 && (
                      <button className={styles.removeOptionButton} onClick={() => removeOption(question.id, index)}>
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}

                {question.options.length < 4 && (
                  <button className={styles.addOptionButton} onClick={() => addOption(question.id)}>
                    Add Option
                  </button>
                )}

                <div className={styles.timerSection}>
                  <label>Timer</label>
                  <div className={styles.timerOptions}>
                    <button
                      className={`${styles.timerButton} ${question.timer === 'OFF' ? styles.selectedTimer : ''}`}
                      onClick={() => handleTimerChange(question.id, 'OFF')}
                    >
                      OFF
                    </button>
                    <button
                      className={`${styles.timerButton} ${question.timer === '5s' ? styles.selectedTimer : ''}`}
                      onClick={() => handleTimerChange(question.id, '5s')}
                    >
                      5 sec
                    </button>
                    <button
                      className={`${styles.timerButton} ${question.timer === '10s' ? styles.selectedTimer : ''}`}
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
        <button onClick={onClose}>Cancel</button>
        <button className={styles.createQuizButton}>Create Quiz</button>
      </div>
    </div>
  );
}

export default QandA;
