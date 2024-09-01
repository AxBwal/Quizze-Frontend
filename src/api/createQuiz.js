import axios from 'axios';

const BACKEND_ORIGIN_URL = 'https://quizze-backend-anshumanakhilnew.vercel.app';

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

export const fetchQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${BACKEND_ORIGIN_URL}/quiz/${quizId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch quiz');
  }
};
export const submitQuizResponse = async (response) => {
  try {
    const result = await axios.post(`${BACKEND_ORIGIN_URL}/quiz/response`, response, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to submit response');
  }
};

export const updateQuiz = async (quizId, updatedData) => {
  try {
    const response = await axios.put(`${BACKEND_ORIGIN_URL}/quiz/${quizId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update quiz');
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const response = await axios.delete(`${BACKEND_ORIGIN_URL}/quiz/${quizId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete quiz');
  }
};
