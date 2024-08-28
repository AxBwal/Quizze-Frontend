import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from '../PollShareModal/PollShareModal.module.css';

function PollShareModal({ uniqueUrl }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user'); // Retrieve the userId from localStorage

  const handleCopyLink = () => {
    navigator.clipboard.writeText(uniqueUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleClose = () => {
    navigate(`/dashboard/${userId}`); // Redirect to the dashboard with the userId
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <h2>Congrats, your Poll is Published!</h2>
        <input
          type="text"
          value={uniqueUrl}
          readOnly
          className={styles.linkInput}
        />
        <button className={styles.shareButton} onClick={handleCopyLink}>
          Share
        </button>
      </div>
    </div>
  );
}

export default PollShareModal;
