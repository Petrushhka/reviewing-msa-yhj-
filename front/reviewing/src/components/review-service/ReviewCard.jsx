import React, { useContext, useEffect, useState } from 'react';
import StarSvg from './StarSvg';
import styles from './card.module.scss';
import axiosInstance from '../../configs/axios-config';
import { API_BASE_URL, REVIEW_SERVICE } from '../../configs/host-config';
import ReviewModal from './ReviewModal';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ReviewCard = ({ reviewInfo, onReviewSubmitted, restaurantName }) => {
  const userId = localStorage.getItem('USER_ID');
  const [isMore, setIsMore] = useState(false);
  const [isShownModalForModify, setIsShownModalForModify] = useState(false);
  const [totalReviewCount, setTotalReviewCount] = useState(0);

  const { id } = useParams();

  const handleCancelBtnClick = () => {
    setIsShownModalForModify(false);
  };

  const handleModifyClick = () => {
    setIsShownModalForModify(true);
  };

  const handleMoreClick = () => {
    setIsMore(!isMore);
  };

  const handleDeleteClick = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const res = axiosInstance.delete(
        `${API_BASE_URL}${REVIEW_SERVICE}/reviews/${reviewInfo.id}`,
      );
    }
  };

  useEffect(() => {
    fetchTotalReviewCount();
  }, []);

  const fetchTotalReviewCount = async () => {
    const res = await axios.get(
      `${API_BASE_URL}${REVIEW_SERVICE}/review/count/${reviewInfo.userId}`,
    );
    console.log(res.data.result);
    setTotalReviewCount(res.data.result);
  };
  const fetchReviewStats = async () => {
    const res = await axios.get(
      `${API_BASE_URL}${REVIEW_SERVICE}/review/count/${reviewInfo.userId}`,
    );
    console.log(res.data.result);
    setTotalReviewCount(res.data.result);
  };
  console.log(reviewInfo);
  return (
    <>
      {isShownModalForModify && (
        <ReviewModal
          handleCancelBtnClick={handleCancelBtnClick}
          onReviewSubmitted={onReviewSubmitted}
          isModify={true}
          modifyingInfo={reviewInfo}
          restaurantName={restaurantName}
        />
      )}
      <div className={styles.entireWrap}>
        <div className={styles.profileWrap}>
          <div className={styles.profile}>
            <div className={styles.profileImage}>
              <img src={reviewInfo.profileImage} alt='' />
            </div>
            <div className={styles.profileBadge}>
              <img src='/icons/beginner.png' alt='' />
            </div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.nickname}>{reviewInfo.nickname}</div>
            <div className={styles.detailedInfo}>
              <span>
                {reviewInfo.badgeInfo.badgeName} 리뷰 {totalReviewCount}개
              </span>
            </div>
          </div>
          <div className={styles.moreBtn}>
            {userId == reviewInfo.userId ? (
              <>
                <svg
                  onClick={handleMoreClick}
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle cx='12' cy='5' r='2' />
                  <circle cx='12' cy='12' r='2' />
                  <circle cx='12' cy='19' r='2' />
                </svg>
                {isMore && (
                  <div className={styles.optionWrap}>
                    <ul>
                      <li onClick={handleModifyClick}>수정</li>
                      <li onClick={handleDeleteClick}>삭제</li>
                    </ul>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className='sup-top-wrap'>
          <div className='rating'>
            <span>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <StarSvg
                    isGold={+reviewInfo.rating >= value ? true : false}
                  />
                ))}
              </div>
            </span>
          </div>
          <div className='uploaded-date'>{reviewInfo.createdAt}</div>
        </div>
        <div className='content-wrap'>
          <p>{reviewInfo && reviewInfo.content}</p>
        </div>
        <div className='image-wrap'>
          {reviewInfo.images.map((imageUrl) => (
            <img src={imageUrl} alt='' width='60px' />
          ))}
        </div>
        <div className='sup-bottom-wrap'></div>
      </div>
    </>
  );
};

export default ReviewCard;
