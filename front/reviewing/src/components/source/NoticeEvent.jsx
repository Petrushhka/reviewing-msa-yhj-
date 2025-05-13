import React from 'react';
import styles from './NoticeEvent.module.scss';

const notices = [
  {
    id: 1,
    type: '공지',
    title: '서비스 점검 안내',
    date: '2025-05-13',
    content: '5월 15일 00:00 ~ 06:00까지 서비스 점검이 진행됩니다.',
  },
  {
    id: 2,
    type: '이벤트',
    title: '신규 회원 이벤트 🎉',
    date: '2025-05-12',
    content: '신규 가입 시 포인트 1,000점을 드립니다!',
  },
  {
    id: 3,
    type: '이벤트',
    title: '리뷰 작성 이벤트 📢',
    date: '2025-05-10',
    content: '리뷰 작성 시 추첨을 통해 상품을 드립니다!',
  },
  {
    id: 4,
    type: '공지',
    title: '앱 업데이트 안내',
    date: '2025-05-09',
    content: '최신 버전으로 앱 업데이트 시 새로운 기능을 사용하실 수 있습니다.',
  },
  {
    id: 5,
    type: '이벤트',
    title: '가정의 달 특별 이벤트 🎁',
    date: '2025-05-05',
    content: '5월 한 달간 전 구매 고객에게 추가 적립 혜택을 드립니다!',
  },
  {
    id: 6,
    type: '공지',
    title: '개인정보 처리방침 변경 안내',
    date: '2025-05-03',
    content:
      '개인정보 처리방침이 5월 20일부터 변경됩니다. 상세 내용을 확인해주세요.',
  },
  {
    id: 7,
    type: '이벤트',
    title: '주말 한정 플래시 세일 🛍️',
    date: '2025-05-11',
    content: '이번 주말, 인기 상품 최대 50% 할인 이벤트를 진행합니다!',
  },
  {
    id: 8,
    type: '공지',
    title: '로그인 보안 강화 안내',
    date: '2025-05-02',
    content: '고객님의 안전한 서비스 이용을 위해 보안 정책이 강화됩니다.',
  },
  {
    id: 9,
    type: '이벤트',
    title: '친구 초대 이벤트 👯',
    date: '2025-05-01',
    content: '친구를 초대하면 두 분 모두 500포인트를 받으실 수 있습니다!',
  },
];

const NoticeEvent = () => {
  return (
    <div className={styles.noticeWrapper}>
      <h2>공지 & 이벤트</h2>
      {notices.map((item) => (
        <div key={item.id} className={styles.noticeCard}>
          <span
            className={`${styles.badge} ${item.type === '공지' ? styles.notice : styles.event}`}
          >
            {item.type}
          </span>
          <div className={styles.content}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <span className={styles.date}>{item.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeEvent;
