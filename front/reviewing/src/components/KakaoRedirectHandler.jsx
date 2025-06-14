import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, USER_SERVICE } from '../configs/host-config';

const KakaoRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 'navigat' 오타 수정 -> 'navigate'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      // axios를 사용하여 GET 요청 보내기
      axios
        .get(`${API_BASE_URL}${USER_SERVICE}/oauth/kakao`, {
          // URL 수정 (API_BASE_URL과 USER_SERVICE 사용)
          params: {
            code: code, // 'code' 파라미터를 params 객체로 전달
          },
        })
        .then((response) => {
          // axios는 기본적으로 2xx 응답에 대해 response.ok 체크가 필요 없음 (자동 에러 처리)
          // 에러가 발생하면 catch 블록으로 바로 넘어갑니다.
          const data = response.data; // axios는 응답 데이터를 response.data에 담아줍니다.

          console.log('백엔드에서 받은 UserInfoDto:', data); // + data 대신 , data 사용

          // 데이터 구조 다시 확인: `data.kakaoAccount.profile.nickname` -> `data.kakaoAccount?.profile?.nickname`
          // 에러 가능성을 줄이기 위해 옵셔널 체이닝 `?.` 사용을 권장합니다.
          const nickName = data.kakaoAccount?.profile?.nickname;
          const email = data.kakaoAccount?.email;
          const profileImageUrl = data.kakaoAccount?.profile?.profileImageUrl;

          navigate('/member/create', {
            // 오타 수정: '/member/creat' -> '/member/create'
            state: {
              nickName: nickName,
              email: email,
              profileImageUrl: profileImageUrl,
              isKakaoLogin: true, // 카카오 로그인임을 나타내는 플래그
            },
          });
        })
        .catch((error) => {
          console.error('카카오 로그인 처리 중 오류 발생: ', error);
          // axios 에러 객체에서 응답 정보를 얻는 방법
          if (error.response) {
            // 서버 응답이 있을 경우 (예: 4xx, 5xx 에러)
            console.error('응답 상태 코드:', error.response.status);
            console.error('응답 데이터:', error.response.data);
            console.error('응답 헤더:', error.response.headers);
          } else if (error.request) {
            // 요청이 만들어졌으나 응답을 받지 못한 경우 (네트워크 에러 등)
            console.error('요청:', error.request);
          } else {
            // 요청 설정 중 오류 발생
            console.error('Error:', error.message);
          }

          navigate('/login', {
            state: { error: '카카오 로그인에 실패했습니다.' },
          });
        });
    } else {
      console.error('카카오 인증 코드가 없습니다.');
      navigate('/login');
    }
  }, [location, navigate]); // 의존성 배열에 location, navigate 포함 (useEffect 사용 시 필수)

  return (
    <div>
      <p>카카오 로그인 처리 중입니다. 잠시만 기다려 주세요...</p>
    </div>
  );
};

export default KakaoRedirectHandler;
