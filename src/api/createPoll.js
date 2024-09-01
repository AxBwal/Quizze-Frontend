import axios from 'axios';

const BACKEND_ORIGIN_URL = 'https://quizze-backend-anshumanakhilnew.vercel.app';

// API to create a poll
export const createPoll = async (pollData) => {
  try {
    const response = await axios.post(`${BACKEND_ORIGIN_URL}/poll/create`, pollData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
    });
    return response.data; // Return the data on success
  } catch (error) {
    console.error('Error in createPoll:', error.response ? error.response.data : error.message);
    throw error.response ? new Error(error.response.data.message || 'Failed to create poll') : new Error('Failed to create poll');
  }
};

// API to update a poll
export const updatePoll = async (pollId, pollData) => {
  try {
    const response = await axios.put(`${BACKEND_ORIGIN_URL}/poll/update/${pollId}`, pollData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
    });
    return response.data; // Return the data on success
  } catch (error) {
    console.error('Error in updatePoll:', error.response ? error.response.data : error.message);
    throw error.response ? new Error(error.response.data.message || 'Failed to update poll') : new Error('Failed to update poll');
  }
};

// API to retrieve a poll by its unique URL
export const getPoll = async (uniqueUrl) => {
  try {
    const response = await axios.get(`${BACKEND_ORIGIN_URL}/poll/${uniqueUrl}`);
    return response.data;
  } catch (error) {
    console.error('Error in getPoll:', error.response ? error.response.data : error.message);
    throw error.response ? new Error(error.response.data.message || 'Failed to fetch poll') : new Error('Failed to fetch poll');
  }
};

// API to submit a poll response
export const submitPollResponse = async (responseData) => {
  try {
    const response = await axios.post(`${BACKEND_ORIGIN_URL}/poll/response`, responseData);
    return response.data;
  } catch (error) {
    console.error('Error in submitPollResponse:', error.response ? error.response.data : error.message);
    throw error.response ? new Error(error.response.data.message || 'Failed to submit response') : new Error('Failed to submit response');
  }
};
