import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from '../PollShareModal/PollShareModal.module.css';

function PollShareModal({ uniqueUrl, onClose }) { // Added onClose prop
  const navigate = useNavigate();
  const userId = localStorage.getItem('user'); // Retrieve the userId from localStorage

  // Log the retrieved userId
  console.log("Retrieved userId from localStorage:", userId);

  const handleCopyLink = () => {
    console.log("Copying link to clipboard:", uniqueUrl);
    navigator.clipboard.writeText(uniqueUrl);
    toast.success('Link copied to clipboard!');
  };


  const handleClose = () => {
    const currentUrl = window.location.pathname; // Get the current URL path
    if (currentUrl === `/dashboard/${userId}`) {
      navigate(`/analytics/${userId}`);
    } else {
      navigate(`/dashboard/${userId}`);
    }
  };


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <div className={styles.modalss}>
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
    </div>
  );
}

export default PollShareModal;
