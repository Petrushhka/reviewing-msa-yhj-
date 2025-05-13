import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import styles from './RestaurantList.module.scss';
import {
  API_BASE_URL,
  RESTAURANT_SERVICE,
  REVIEW_SERVICE,
} from '../../configs/host-config';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState('latest');

  const observer = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchName = queryParams.get('searchName');

  const fetchData = async (currentPage) => {
    try {
      let res;
      if (!searchName) {
        res = await axios.get(
          `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurant/list?page=${currentPage}&size=10`,
        );
      } else {
        res = await axios.get(
          `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurant/list?searchName=${searchName}&address=${searchName}&page=${currentPage}&size=10`,
        );
      }

      const restaurantData = res.data.result;
      if (restaurantData.length === 0) setHasMore(false);

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

      setRestaurants((prev) => [...prev, ...updatedRestaurants]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, searchName]);

  const lastRestaurantRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore],
  );

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
        {sortedRestaurants.map((item, idx) => (
          <Link
            className={styles.link}
            key={item.id}
            to={`/restaurantDetail/${item.id}`}
            ref={
              idx === sortedRestaurants.length - 1 ? lastRestaurantRef : null
            }
          >
            <RestaurantCard restaurant={item} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default RestaurantList;
