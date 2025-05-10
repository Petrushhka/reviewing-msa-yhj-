import React, { useContext, useState } from 'react';
import StarSvg from './StarSvg';
import styles from './card.module.scss';
import axiosInstance from '../../configs/axios-config';
import { API_BASE_URL, REVIEW_SERVICE } from '../../configs/host-config';

const ReviewCard = ({ reviewInfo }) => {
  const userId = localStorage.getItem('USER_ID');
  const [isMore, setIsMore] = useState(false);

  const handleMoreClick = () => {
    setIsMore(!isMore);
  };

  const handleUpdateClick = () => {};
  const handleDeleteClick = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const res = axiosInstance.delete(
        `${API_BASE_URL}${REVIEW_SERVICE}/reviews/${reviewInfo.id}`,
      );
    }
  };

  return (
    <>
      <div className={styles.entireWrap}>
        <div className={styles.profileWrap}>
          <div className={styles.profileImage}></div>
          <div className={styles.profileInfo}>
            <div className={styles.nickname}>{reviewInfo.nickname}</div>
            <div className={styles.detailedInfo}>
              <span>지역 가이드 리뷰 3,172개 사진 44831장</span>
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
                      <li onClick={handleUpdateClick}>수정</li>
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
          <div className='uploaded-date'>2018.05.05</div>
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
