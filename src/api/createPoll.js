import axios from 'axios';

const BACKEND_ORIGIN_URL = 'http://localhost:3000';

// API to create a poll
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

// API to retrieve a poll by its unique URL
export const getPoll = async (uniqueUrl) => {
  try {
    const response = await axios.get(`${BACKEND_ORIGIN_URL}/poll/${uniqueUrl}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch poll');
  }
};

// API to submit a poll response
export const submitPollResponse = async (responseData) => {
  try {
    const response = await axios.post(`${BACKEND_ORIGIN_URL}/poll/response`, responseData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to submit response');
  }
};
