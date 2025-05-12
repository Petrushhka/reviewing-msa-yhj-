import styles from './RestaurantCard.module.scss';

const RestaurantCard = ({ restaurant }) => {
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
      </div>
    </div>
  );
};

export default RestaurantCard;
