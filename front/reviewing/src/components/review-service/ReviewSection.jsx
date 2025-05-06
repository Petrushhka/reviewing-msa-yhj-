import React, { useState } from 'react';
import ReviewModal from './ReviewModal';
import ReviewCard from './ReviewCard';
import styles from './section.module.scss';

const ReviewSection = () => {
  const [isShowModal, setIsShowModal] = useState(false);

  const handleReviewBtnClick = () => {
    setIsShowModal(true);
  };
  const handleCancelBtnClick = () => {
    setIsShowModal(false);
  };

  return (
    <>
      {isShowModal ? (
        <ReviewModal handleCancelBtnClick={handleCancelBtnClick} />
      ) : null}
      <div className={styles.entireWrap}>
        <div className={styles.reviewWriteBtnWrap}>
          <button type='button' onClick={handleReviewBtnClick}>
            리뷰하기
          </button>
        </div>
        <div className={styles.reviewsWrap}>
          <ul>
            <li>
              <ReviewCard />
            </li>
            <li>
              <ReviewCard />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ReviewSection;
