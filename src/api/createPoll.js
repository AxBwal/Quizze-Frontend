import axios from 'axios';

const BACKEND_ORIGIN_URL = 'http://localhost:3000';

export const createPoll = async (pollData) => {
  try {
    const response = await axios.post(`${BACKEND_ORIGIN_URL}/poll/create`, pollData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create poll');
  }
};
