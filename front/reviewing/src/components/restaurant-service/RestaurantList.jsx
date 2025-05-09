import RestaurantCard from './RestaurantCard';
import styles from './RestaurantList.module.scss';

const RestaurantList = () => {
  const restaurants = [
    {
      id: 1,
      name: '스시 오마카세 히로',
      description: '신선한 해산물과 정성 가득한 오마카세 전문점입니다.',
      mainImageUrl: 'https://source.unsplash.com/featured/?sushi',
    },
    {
      id: 2,
      name: '홍콩반점 0410',
      description: '매콤한 짬뽕과 고소한 짜장면이 일품인 중식당.',
      mainImageUrl: 'https://source.unsplash.com/featured/?noodles',
    },
    {
      id: 3,
      name: '브런치 카페 블룸',
      description: '따뜻한 분위기에서 즐기는 건강한 브런치와 커피.',
      mainImageUrl: 'https://source.unsplash.com/featured/?brunch',
    },
    {
      id: 4,
      name: '교동 찜닭',
      description: '달콤짭짤한 찜닭과 푸짐한 양이 자랑인 한식 맛집.',
      mainImageUrl: 'https://source.unsplash.com/featured/?koreanfood',
    },
    {
      id: 5,
      name: '파스타공방',
      description: '신선한 재료로 만든 수제 파스타와 리조또 전문점.',
      mainImageUrl: 'https://source.unsplash.com/featured/?pasta',
    },
  ];
  return (
    <div className={styles.list}>
      {restaurants.map((item) => (
        <RestaurantCard key={item.id} restaurant={item} />
      ))}
    </div>
  );
};

export default RestaurantList;
