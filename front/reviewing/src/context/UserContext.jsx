import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../configs/host-config';

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogin: () => {},
  onLogout: () => {},
  userRole: '',
  userName: '',
  badge: null,
  setBadge: () => {},
  userId: null,
  userImage: '', // 유저 프로필사진
  setUserImage: () => {},
  isInit: false,
  fetchLatestBadge: () => {}, // ✅ 초기값에도 추가 (오타 수정)
});

export const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [badge, setBadge] = useState(null);
  const [isInit, setIsInit] = useState(false);
  const [userImage, setUserImage] = useState('');

  // ✅ 서버에서 최신 배지 불러오기 (로그인 시 + 새로고침 시)
  const fetchLatestBadge = async (id, userRole) => {
    try {
      const pointRes = await axios.get(
        `${API_BASE_URL}/user-service/user/${id}/point`,
      );
      const point = pointRes.data;

      const badgeRes = await axios.post(`${API_BASE_URL}/badges/assign`, {
        userId: id,
        point,
        role: userRole,
      });

      const newBadge = badgeRes.data.result;
      console.log('✅ 서버에서 최신 배지 불러옴:', newBadge);
      setBadge(newBadge);
      localStorage.setItem('USER_ICON', JSON.stringify(newBadge));
    } catch (e) {
      console.error('❌ 최신 배지 동기화 실패:', e);
    }
  };

  // 로그인 함수: 상태 + 배지까지 한 번에처리리
  const loginHandler = async (loginData) => {
    console.log('[loginHandler] 로그인 응답 데이터:', loginData);

    // 로컬스토리지 저장
    localStorage.setItem('ACCESS_TOKEN', loginData.token);
    localStorage.setItem('USER_ID', loginData.id);
    localStorage.setItem('USER_ROLE', loginData.role);
    localStorage.setItem('USER_NICKNAME', loginData.nickName);
    localStorage.setItem('USER_IMAGE', loginData.profileImage);

    // 상태저장
    setIsLoggedIn(true);
    setUserId(loginData.id);
    setUserRole(loginData.role);
    setUserName(loginData.nickName);
    setUserImage(loginData.profileImage);

    // 배지 상태도 이 안에서 설정
    await fetchLatestBadge(loginData.id, loginData.role);
  };

  const logoutHandler = () => {
    console.log('[logoutHandler] 로그아웃 수행');
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole('');
    setUserName('');
    setBadge(null);
    setUserImage('');
  };

  useEffect(() => {
    console.log('🌀 [useEffect] 초기 렌더링 시 로컬스토리지 확인');
    const storedToken = localStorage.getItem('ACCESS_TOKEN');

    if (storedToken) {
      const storedId = localStorage.getItem('USER_ID');
      const storedRole = localStorage.getItem('USER_ROLE');
      const storedName = localStorage.getItem('USER_NICKNAME');
      const storedBadge = localStorage.getItem('USER_ICON');
      const storedImage = localStorage.getItem('USER_IMAGE');

      setIsLoggedIn(true);
      setUserId(storedId);
      setUserRole(storedRole);
      setUserName(storedName);
      if (storedImage) {
        setUserImage(storedImage);
      }
      // 1차 로컬 복원
      if (storedBadge) {
        try {
          const parsed = JSON.parse(storedBadge);
          setBadge(parsed);
          console.log('📦 로컬 배지 복원됨:', parsed);
        } catch (e) {
          console.error('⚠️ 로컬 배지 파싱 실패:', e);
        }
      }
    }

    setIsInit(true);
  }, []);

  // 모든 상태가 준비되면 서버에서 배지 최신화 (로그인 or 새로고침 모두 포함)
  useEffect(() => {
    if (userId && userRole && isLoggedIn) {
      console.log('상태 준비 완료 -> 최신 배지 요청');
      fetchLatestBadge(userId, userRole);
    }
  }, [userId, userRole, isLoggedIn]);

  useEffect(() => {
    console.log('[badge state] 현재 badge 상태:', badge);
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
        setBadge,
        userImage,
        setUserImage,
        isInit,
        fetchLatestBadge, // ✅ 외부에서 사용 가능하게 export
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
