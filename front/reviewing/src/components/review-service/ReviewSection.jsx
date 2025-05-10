import React, { useEffect, useState } from 'react';
import ReviewModal from './ReviewModal';
import ReviewCard from './ReviewCard';
import styles from './section.module.scss';
import axiosInstance from '../../configs/axios-config';
import axios from 'axios';
import { API_BASE_URL, REVIEW_SERVICE } from '../../configs/host-config';

const ReviewSection = () => {
  const [isShownModal, setIsShownModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      `${API_BASE_URL}${REVIEW_SERVICE}/reviews/restaurant/1`,
    );
    console.log(res.data.result);
    setReviews(res.data.result);
  }, []);

  const handleReviewBtnClick = () => {
    setIsShownModal(true);
  };
  const handleCancelBtnClick = () => {
    setIsShownModal(false);
  };

  return (
    <>
      {isShownModal && (
        <ReviewModal handleCancelBtnClick={handleCancelBtnClick} />
      )}
      <div className={styles.entireWrap}>
        <div className={styles.reviewWriteBtnWrap}>
          <button type='button' onClick={handleReviewBtnClick}>
            리뷰하기
          </button>
        </div>
        <div className={styles.reviewsWrap}>
          <ul>
            {reviews.map((review) => (
              <li>
                <ReviewCard key={review.id} reviewInfo={review} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ReviewSection;
