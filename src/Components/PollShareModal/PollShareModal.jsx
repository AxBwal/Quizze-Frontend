import React from 'react';
import toast from 'react-hot-toast';
import styles from '../PollShareModal/PollShareModal.module.css';

function PollShareModal({ uniqueUrl, onClose }) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(uniqueUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
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
