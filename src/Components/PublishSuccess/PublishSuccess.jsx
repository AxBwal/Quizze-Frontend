import React from 'react';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from '../PublishSuccess/PublishSuccess.module.css';

function PublishSuccess({ uniqueUrl, onClose }) {
  const quizLink = `http://localhost:5173/sharedquiz/${uniqueUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizLink);
    toast.success('Link copied to Clipboard!');
  };

  return (
    <div className={styles.publishSuccessContainer}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={onClose}>
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
