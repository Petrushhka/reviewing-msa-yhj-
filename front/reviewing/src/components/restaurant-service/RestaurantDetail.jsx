import { useState, useEffect } from 'react';
import styles from './RestaurantDetail.module.scss';
import axios from 'axios';
import { API_BASE_URL, RESTAURANT_SERVICE } from '../../configs/host-config';
import { useNavigate, useParams } from 'react-router-dom';
import NaverMapComponent from '../NaverMapComponent';
import ReviewSection from '../review-service/ReviewSection';

const RestaurantDetail = () => {
  const [restaurants, setRestaurants] = useState({});
  const [currentImage, setCurrentImage] = useState(0);
  const [address, setAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurants/${id}`,
      );
      console.log(res.data.result);
      setRestaurants(res.data.result);
      setAddress(res.data.result.address);
    } catch (e) {
      console.log(e);
    }
  };

  if (!restaurants) return <div>Loading...</div>;

  const images = restaurants.imageUrls || ['/default.jpg'];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const token = localStorage.getItem('ACCESS_TOKEN');

  useEffect(() => {
    if (token && restaurants.userId) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsOwner(
          (String(localStorage.getItem('USER_ID')) ===
            String(restaurants.userId) &&
            payload.role === 'OWNER') ||
            payload.role === 'ADMIN',
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [restaurants]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert('상점이 삭제되었습니다.');
      navigate('/restaurant');
    } catch (e) {
      console.log(e);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/restaurantUpdate/${id}`); // 수정 페이지로 이동
  };

  return (
    <div className={styles.detailWrapper}>
      {isOwner && (
        <div className={styles.actions}>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}

      <div className={styles.imageSection}>
        <img src={images[currentImage]} alt='상점 이미지' />
        {images.length > 1 && (
          <div className={styles.slideControls}>
            <button onClick={prevImage}>&lt;</button>
            <button onClick={nextImage}>&gt;</button>
          </div>
        )}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.row}>
          <strong>상점명</strong>
          <div className={styles.separator} /> <span>{restaurants.name}</span>
        </div>
        <div className={styles.row}>
          <strong>연락처</strong>
          <div className={styles.separator} /> <span>{restaurants.phone}</span>
        </div>
        <div className={styles.row}>
          <strong>위치</strong>
          <div className={styles.separator} />{' '}
          <div>
            <div>{restaurants.address}</div>
            <div>
              {address && (
                <NaverMapComponent
                  address={address}
                  width='500px'
                  height='300px'
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <strong>소개글</strong>
          <div className={styles.separator} />{' '}
          <span>{restaurants.description}</span>
        </div>
      </div>
      <ReviewSection restaurantId={id} restaurantName={restaurants.name} />
    </div>
  );
};

export default RestaurantDetail;
