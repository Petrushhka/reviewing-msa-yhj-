import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') {
      // 메인(홈) 페이지가 아닐 때만
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return null; // 렌더링하는 UI 없음
};

export default ScrollToTopOnRouteChange;
