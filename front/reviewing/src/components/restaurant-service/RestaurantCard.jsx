import styles from './RestaurantCard.module.scss';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className={styles.card}>
      <a href={`/restaurant/${restaurant.id}`} className={styles.link}>
        <div className={styles.thumb}>
          <img src={restaurant.mainImageUrl || '/default.jpg'} alt="식당 이미지" />
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>{restaurant.name}</h4>
          <p className={styles.description}>{restaurant.description}</p>
        </div>
      </a>
    </div>
  );
};

export default RestaurantCard;