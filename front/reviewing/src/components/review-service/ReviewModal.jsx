import React, { useContext, useRef, useState } from 'react';
import styles from './modal.module.scss';
import StarSvg from './StarSvg';
import AuthContext from '../../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../configs/axios-config';
import { API_BASE_URL, REVIEW_SERVICE } from '../../configs/host-config';
import { handleAxiosError } from '../../configs/HandleAxiosError';
const ReviewModal = ({ handleCancelBtnClick }) => {
  const [reviewImages, setReviewImages] = useState([]);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const $fileTag = useRef();
  const location = useLocation();
  const { onLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  // 쿼리스트링 파싱
  const queryParams = new URLSearchParams(location.search);
  const restaurantId = queryParams.get('restaurantId');

  const handlePostBtnClick = (e) => {
    postReview(e);
  };

  const postReview = async (e) => {
    const reviewBody = new FormData();
    reviewBody.append('userId', localStorage.getItem('USER_ID'));
    reviewBody.append('restaurantId', 1);
    reviewBody.append('rating', rating);
    reviewBody.append('content', reviewContent);
    const files = reviewImages;
    for (let i = 0; i < files.length; i++) {
      reviewBody.append('images', files[i]);
    }
    try {
      await axiosInstance.post(
        `${API_BASE_URL}${REVIEW_SERVICE}/review`,
        reviewBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      alert('리뷰 등록 완료!');
      handleCancelBtnClick();
    } catch (e) {
      handleAxiosError(e, onLogout, navigate);
    }
  };

  const updateFiles = () => {
    const files = $fileTag.current.files;
    setReviewImages(files);
    handleThumbnailPreview();
  };

  const handleThumbnailPreview = () => {
    const files = $fileTag.current.files;
    const thumbnailPromises = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });

      reader.readAsDataURL(files[i]);
      thumbnailPromises.push(promise);
    }

    Promise.all(thumbnailPromises).then((thumbnails) => {
      setThumbnailImages(thumbnails);
    });
  };

  const handleStarClick = (value) => {
    setRating(value);
  };
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
              {[1, 2, 3, 4, 5].map((value) => (
                <StarSvg
                  isGold={rating >= value ? true : false}
                  handleClick={() => handleStarClick(value)}
                />
              ))}
            </span>
          </div>
          <div className='contentWrap'>
            <textarea
              className={styles.reviewTextArea}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder='이곳에 다녀온 경험을 자세히 공유해 주세요.'
            ></textarea>
          </div>
          <div className='imageAddWrap'>
            <input
              type='file'
              onChange={updateFiles}
              ref={$fileTag}
              accept='image/*'
              multiple
            />
          </div>
          <div className='imagesWrap'>
            {thumbnailImages &&
              thumbnailImages.map((value, index) => {
                return <img src={value} style={{ width: '70px' }} />;
              })}
          </div>
        </div>
        <div className='buttonsWrap'>
          <button type='button' onClick={handleCancelBtnClick}>
            취소
          </button>
          <button type='button' onClick={handlePostBtnClick}>
            게시
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
