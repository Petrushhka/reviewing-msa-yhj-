import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogin: () => {},
  onLogout: () => {},
  userRole: '',
  userName: '',
  badge: null,
  isInit: false,
});

// 위에서 생성한 Context를 제공하는 Provider 선언.
// 이 Provider를 통해 자식 컴포넌트(Consumer)에게 인증 상태와 관련된 값, 함수를 전달할 수 있음.
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [badge, setBadge] = useState(null);
  const [isInit, setIsInit] = useState(false); // 초기화 완료 상태 추가

  // 로그인 시 실행할 핸들러
  const loginHandler = (loginData) => {
    console.log('🟢 [loginHandler] 로그인 응답 데이터:', loginData);
    console.log('🟢 [loginHandler] badge 정보:', loginData.badge);

    // 백엔드가 응답한 JSON 인증 정보를 클라이언트쪽에 보관하자.
    localStorage.setItem('ACCESS_TOKEN', loginData.token);
    localStorage.setItem('USER_ID', loginData.id);
    localStorage.setItem('USER_ROLE', loginData.role);
    localStorage.setItem('USER_NAME', loginData.name); // 이름도 저장
    localStorage.setItem('USER_ICON', JSON.stringify(loginData.badge));

    setIsLoggedIn(true);
    setUserRole(loginData.role);
    setUserName(loginData.name);
    setBadge(loginData.badge);
  };

  // 로그아웃 핸들러
  const logoutHandler = () => {
    console.log('🔴 [logoutHandler] 로그아웃 수행');
    localStorage.clear(); // 로컬스토리지 전체 삭제
    setIsLoggedIn(false);
    setUserRole('');
    setUserName('');
    setBadge(null);
  };

  // 첫 렌더링 시에 이전 로그인 정보를 확인해서 로그인 상태 유지 시키기.
  useEffect(() => {
    console.log('🌀 [useEffect] 초기 렌더링 시 로컬스토리지 확인');
    if (localStorage.getItem('ACCESS_TOKEN')) {
      console.log('✅ ACCESS_TOKEN 발견됨 → 로그인 유지');
      setIsLoggedIn(true);
      setUserRole(localStorage.getItem('USER_ROLE'));
      setUserName(localStorage.getItem('USER_NAME'));

      const storedBadge = localStorage.getItem('USER_ICON');
      console.log('로컬 스토리지에서 읽은 USER_ICON:', storedBadge);
      if (storedBadge) {
        try {
          const parsedBadge = JSON.parse(storedBadge);
          console.log('✅ [useEffect] 파싱된 badge:', parsedBadge);
          setBadge(parsedBadge);
        } catch (e) {
          console.error('배지 정보 파싱 실패', e);
          setBadge(null);
        }
      }
    }
    setIsInit(true);
  }, []);

  // badge 상태 변화 감지 로그
  useEffect(() => {
    console.log('🧩 [badge state] 현재 badge 상태:', badge);
  }, [badge]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        onLogin: loginHandler,
        onLogout: logoutHandler,
        userRole,
        userName,
        badge,
        isInit,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
