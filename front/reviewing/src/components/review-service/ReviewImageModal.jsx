import React from 'react';
import styles from './imageModal.module.scss';

const ReviewImageModal = ({ imageUrl, handleClickBg }) => {
  return (
    <div className={styles.modalOverlay} onClick={handleClickBg}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt='' />
      </div>
    </div>
  );
};

export default ReviewImageModal;
