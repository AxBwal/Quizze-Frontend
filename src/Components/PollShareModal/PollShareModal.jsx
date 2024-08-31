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
    console.log("Close button clicked");
    
    // First, close the modal
    onClose(); // Immediately close the modal
    
    // Then navigate to the analytics page
    if (userId) {
      console.log("Navigating to analytics page with userId:", userId);
      navigate(`/analytics/${userId}`); // Redirect to the analytics page with the userId
    } else {
      console.error('User ID not found. Cannot redirect to analytics.');
      toast.error('User ID not found. Cannot redirect to analytics.');
      navigate(`/signin`); // Fallback to sign in if userId is not found
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
