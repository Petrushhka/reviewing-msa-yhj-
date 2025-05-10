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

export const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState(''); // 상태 변수는 그대로 유지
  const [badge, setBadge] = useState(null);
  const [isInit, setIsInit] = useState(false);

  const loginHandler = (loginData) => {
    console.log('🟢 [loginHandler] 로그인 응답 데이터:', loginData);
    console.log('🟢 [loginHandler] badge 정보:', loginData.badge);

    // ✅ nickName 기준으로 저장
    localStorage.setItem('ACCESS_TOKEN', loginData.token);
    localStorage.setItem('USER_ID', loginData.id);
    localStorage.setItem('USER_ROLE', loginData.role);
    localStorage.setItem('USER_NICKNAME', loginData.nickName);
    localStorage.setItem('USER_ICON', JSON.stringify(loginData.badge));

    setIsLoggedIn(true);
    setUserId(loginData.id);
    setUserRole(loginData.role);
    setUserName(loginData.nickName); // 상태에 저장
    setBadge(loginData.badge);
  };

  const logoutHandler = () => {
    console.log('🔴 [logoutHandler] 로그아웃 수행');
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole('');
    setUserName('');
    setBadge(null);
  };

  useEffect(() => {
    console.log('🌀 [useEffect] 초기 렌더링 시 로컬스토리지 확인');
    if (localStorage.getItem('ACCESS_TOKEN')) {
      console.log('✅ ACCESS_TOKEN 발견됨 → 로그인 유지');
      setIsLoggedIn(true);
      setUserId(localStorage.getItem('USER_ID'));
      setUserRole(localStorage.getItem('USER_ROLE'));
      setUserName(localStorage.getItem('USER_NICKNAME')); // ✅ nickName 기준으로 복원

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
        userId,
        badge,
        isInit,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
