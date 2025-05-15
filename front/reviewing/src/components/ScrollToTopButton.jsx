import React, { useEffect, useState } from 'react';
import styles from './ScrollToTopButton.module.scss'; // 아래 SCSS 참고

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 스크롤 감지 핸들러
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // 100px 이상 내리면 노출
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 숨겨져 있으면 렌더 X
  if (!show) return null;

  return (
    <button
      className={styles['scroll-to-top-btn']}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label='맨 위로'
    >
      ▲
    </button>
  );
};

export default ScrollToTopButton;
