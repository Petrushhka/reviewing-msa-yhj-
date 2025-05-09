// ✅ RestaurantDetail.jsx (세로 구분선 적용)
import { useState, useEffect } from 'react';
import styles from './RestaurantDetail.module.scss';

const RestaurantDetail = ({ restaurantId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dummyData = {
      id: restaurantId,
      name: '스시 오마카세 히로',
      description: '신선한 해산물과 정성 가득한 오마카세 전문점입니다.',
      address: '서울 강남구 테헤란로 123',
      phone: '010-0000-0000',
      mainImageUrl: 'https://restaurantservice-image2400.s3.ap-northeast-2.amazonaws.com/d1521755-f638-4f90-ac52-fe48a71d6403_basic.jpg',
    };
    setData(dummyData);
  }, [restaurantId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className={styles.detailWrapper}>
      <div className={styles.actions}>
        <button>수정</button>
        <button>삭제</button>
      </div>

      <div className={styles.imageSection}>
        <img src={data.mainImageUrl || '/default.jpg'} alt='상점 이미지' />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.row}>
          <strong>상점명</strong>
          <div className={styles.separator} /> <span>{data.name}</span>
        </div>
        <div className={styles.row}>
          <strong>연락처</strong>
          <div className={styles.separator} /> <span>{data.phone}</span>
        </div>
        <div className={styles.row}>
          <strong>위치</strong>
          <div className={styles.separator} /> <span>{data.address}</span>
        </div>
        <div className={styles.row}>
          <strong>소개글</strong>
          <div className={styles.separator} /> <span>{data.description}</span>
        </div>
      </div>
      
    </div>
  );
};

export default RestaurantDetail;
