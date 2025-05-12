import { useState } from 'react';
import styles from './RestaurantCard.module.scss';
import axios from 'axios';
import { API_BASE_URL, REVIEW_SERVICE } from '../../configs/host-config';

const RestaurantCard = ({ restaurant }) => {
  const [reviewCount, setCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const fetchStats = async (id) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}${REVIEW_SERVICE}/reviews/stats/restaurant/${id}`,
      );
      console.log(res.data, 'dsds');
      setCount(res.data.count);
      setAverageRating(res.data.averageRating);
    } catch (e) {
      console.log(e);
    }
  };

  fetchStats(restaurant.id);

  return (
    <div className={styles.card}>
      <div className={styles.link}>
        <div className={styles.thumb}>
          {console.log(restaurant.imageUrls)}
          <img
            src={restaurant.imageUrls[0] || '/default.jpg'}
            alt='식당 이미지'
          />
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>{restaurant.name}</h4>
          <p className={styles.description}>{restaurant.description}</p>
        </div>
        <div className={styles.footer}>
          <span>
            ⭐ {restaurant.averageRating ? averageRating.toFixed(1) : 0} / 5.0
          </span>
          <span>📝 {restaurant.reviewCount} 리뷰</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
