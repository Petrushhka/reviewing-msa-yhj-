import React from 'react';
import styles from './modal.module.scss';
import StarSvg from './StarSvg';
const ReviewModal = ({ handleCancelBtnClick }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.entireWrap}>
        <div className='restaurantNameWrap'>
          <span>서울남부버스터미널</span>
        </div>
        <div className='reviewWrap'>
          <div className='profileWrap'>
            <div className='profileImageWrap'></div>
            <div className='profileNameWrap'></div>
          </div>
          <div className='ratingWrap'>
            <span>
              <StarSvg isGold={true} />
              <StarSvg isGold={true} />
              <StarSvg isGold={true} />
              <StarSvg isGold={true} />
              <StarSvg isGold={true} />
            </span>
          </div>
          <div className='contentWrap'>
            <textarea
              className={styles.reviewTextArea}
              name=''
              id=''
              placeholder='이곳에 다녀온 경험을 자세히 공유해 주세요.'
            ></textarea>
          </div>
          <div className='imageAddWrap'>
            <input type='file' name='' id='' accept='image/*' />
          </div>
          <div className='imagesWrap'></div>
        </div>
        <div className='buttonsWrap'>
          <button type='button' onClick={handleCancelBtnClick}>
            취소
          </button>
          <button type='button'>게시</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
