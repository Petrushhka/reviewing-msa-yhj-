import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import styles from './RestaurantList.module.scss';
import {
  API_BASE_URL,
  RESTAURANT_SERVICE,
  REVIEW_SERVICE,
} from '../../configs/host-config';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [sortOption, setSortOption] = useState('latest');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurant/list`,
      );
      const restaurantData = res.data.result;

      // 리뷰, 평점 추가 정보 불러오기
      const updatedRestaurants = await Promise.all(
        restaurantData.map(async (restaurant) => {
          try {
            const statsRes = await axios.get(
              `${API_BASE_URL}${REVIEW_SERVICE}/reviews/stats/restaurant/${restaurant.id}`,
            );
            return {
              ...restaurant,
              reviewCount: statsRes.data.count,
              averageRating: statsRes.data.averageRating,
            };
          } catch (e) {
            console.log(e);
            return { ...restaurant, reviewCount: 0, averageRating: 0 };
          }
        }),
      );

      setRestaurants(updatedRestaurants);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'review') {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    } else if (sortOption === 'rating') {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    return 0;
  });

  return (
    <>
      <div className={styles.sortWrapper}>
        <select onChange={handleSortChange} value={sortOption}>
          <option value='latest'>최신순</option>
          <option value='review'>리뷰순</option>
          <option value='rating'>평점순</option>
        </select>
      </div>
      <div className={styles.list}>
        {sortedRestaurants.map((item) => (
          <Link key={item.id} to={`/restaurantDetail/${item.id}`}>
            <RestaurantCard key={item.id} restaurant={item} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default RestaurantList;
