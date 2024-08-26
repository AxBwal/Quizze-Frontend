import React from 'react';
import styles from '../ConfirmationPopup/ConfirmationPopup.module.css'; // You can style this as needed

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <p>{message}</p>
        <div className={styles.popupActions}>
          <button className={styles.confirmButton} onClick={onConfirm}>Confirm Delete</button>
          <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
