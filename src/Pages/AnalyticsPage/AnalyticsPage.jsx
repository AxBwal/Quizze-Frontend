import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../AnalyticsPage/AnalyticsPage.module.css'; // Assuming you have a CSS module
import ConfirmationPopup from '../../Components/ConfirmationPopup/ConfirmationPopup';
// Import the new popup component

function AnalyticsPage() {
  const { userId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        console.log('Fetching quizzes for user:', userId);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/quiz/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Quizzes fetched:', response.data);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const handleShareQuiz = async (quizId) => {
    console.log('Attempting to fetch quiz with ID:', quizId); // Log the quizId being used
  
    try {
      const response = await axios.get(`http://localhost:3000/quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      console.log('Response from backend:', response.data); // Log the response from the backend
  
      const shareableLink = `${window.location.origin}/sharedquiz/${response.data.uniqueId}`;
      
      console.log('Generated shareable link:', shareableLink); // Log the generated shareable link
      
      navigator.clipboard.writeText(shareableLink);
      toast.success(`Link copied to clipboard: ${shareableLink}`);
    } catch (error) {
      console.error('Failed to fetch the share link:', error.message); // Log the error message
      toast.error('Failed to fetch the share link');
    }
  };
  
  
  
  

  const handleDeleteQuiz = (quizId) => {
    setQuizToDelete(quizId);
    setShowDeletePopup(true);
  };

  const confirmDeleteQuiz = async () => {
    try {
      console.log('Deleting quiz with ID:', quizToDelete);
      await axios.delete(`http://localhost:3000/quiz/${quizToDelete}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete));
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error('Failed to delete the quiz');
      console.error('Error:', error.message);
    } finally {
      setShowDeletePopup(false);
      setQuizToDelete(null);
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.analyticsContainer}>
      <h2>Quiz Analysis</h2>
      <table className={styles.analyticsTable}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created On</th>
            <th>Impressions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz._id}>
              <td>{index + 1}</td>
              <td>{`Quiz ${index + 1}`}</td>
              <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
              <td>{quiz.impressions}</td>
              <td>
                <button onClick={() => handleShareQuiz(quiz._id)}>Share</button>
                <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeletePopup && (
        <ConfirmationPopup
          message="Are you sure you want to delete this quiz?"
          onConfirm={confirmDeleteQuiz}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </div>
  );
}

export default AnalyticsPage;
