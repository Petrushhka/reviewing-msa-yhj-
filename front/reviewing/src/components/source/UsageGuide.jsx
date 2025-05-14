import React from 'react';
import styles from './UsageGuide.module.scss';

const steps = [
  {
    id: 1,
    title: '회원가입 & 로그인',
    desc: '이메일·비밀번호를 입력해 계정을 생성하고 로그인합니다.',
  },
  {
    id: 2,
    title: '맛집 둘러보기',
    desc: '리스트에서 마음에 드는 맛집을 클릭하면 상세 정보를 확인할 수 있어요.',
  },
  {
    id: 3,
    title: '검색 & 정렬',
    desc: '검색창에 키워드를 입력하거나 최신순 / 리뷰순 / 평점순으로 정렬해보세요.',
  },
  {
    id: 4,
    title: '맛집 등록 (OWNER)',
    desc: 'OWNER 권한으로 로그인한 뒤 “상점 등록” 버튼을 눌러 새 맛집을 추가합니다.',
  },
  {
    id: 5,
    title: '리뷰 작성',
    desc: '상세 페이지 하단에서 별점과 후기를 등록할 수 있습니다.',
  },
  {
    id: 6,
    title: '커뮤니티 참여',
    desc: '커뮤니티 탭에서 다양한 게시글을 읽고, 좋아요·댓글을 남겨보세요.',
  },
];

const UsageGuide = () => {
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.heading}>이용 가이드</h1>

      <ol className={styles.stepList}>
        {steps.map(({ id, title, desc }, idx) => (
          <li key={id} className={styles.step}>
            <div className={styles.iconBox}>{idx + 1}</div>
            <div className={styles.textBox}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.desc}>{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <aside className={styles.tipBox}>
        <strong>TIP</strong> | 모바일에서도 동일한 기능을 제공하니 언제 어디서든
        편하게 이용해보세요!
      </aside>
    </section>
  );
};

export default UsageGuide;
