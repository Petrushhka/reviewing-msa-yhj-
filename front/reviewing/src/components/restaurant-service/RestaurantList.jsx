import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import styles from './RestaurantList.module.scss';
import { API_BASE_URL, RESTAURANT_SERVICE } from '../../configs/host-config';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurant/list`,
      );
      console.log(res.data.result);
      setRestaurants(res.data.result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.list}>
      {restaurants.map((item) => (
        <Link key={item.id} to={`/restaurantDetail/${item.id}`}>
          <RestaurantCard key={item.id} restaurant={item} />
        </Link>
      ))}
    </div>
  );
};

export default RestaurantList;
