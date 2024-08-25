import axios from 'axios';

const BACKEND_ORIGIN_URL = 'http://localhost:3000';

export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${BACKEND_ORIGIN_URL}/quiz/create`, quizData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create quiz');
  }
};
