import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from '../PublishSuccess/PublishSuccess.module.css';

function PublishSuccess({ uniqueUrl }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user'); // Retrieve the userId from localStorage

  const quizLink = `http://localhost:5173/sharedquiz/${uniqueUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizLink);
    toast.success('Link copied to Clipboard!');
  };

  const handleClose = () => {
    navigate(`/dashboard/${userId}`); // Redirect to the dashboard with the userId
  };

  return (
    <div className={styles.publishSuccessContainer}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
      <h2>Congrats your Quiz is Published!</h2>
      <div className={styles.linkContainer}>
        <input
          type="text"
          value={quizLink}
          readOnly
          className={styles.quizLinkInput}
        />
        <button className={styles.shareButton} onClick={handleCopyLink}>
          Share
        </button>
      </div>
    </div>
  );
}

export default PublishSuccess;
