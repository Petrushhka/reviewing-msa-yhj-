import styles from './MyPageUser.module.scss';
import { useContext, useRef, useState } from 'react';
import AuthContext from '../context/UserContext';
import axios from 'axios';
import { API_BASE_URL } from '../configs/host-config';

const MyPageUser = () => {
  const { userRole, userName, badge, userId, userImage, setUserImage } =
    useContext(AuthContext);

  // 프로필 이미지 변경
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(userImage);

  // 닉네임, 비밀번호 바꾸기
  const [newNickName, setNewNickName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const formData = new FormData();
    formData.append('id', userId);
    formData.append('profileImage', file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/user-service/user/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          },
        },
      );

      const newImageUrl = res.data.result.newProfileName;
      const finalUrl = `${newImageUrl}?=${Date.now()}`;
      setUserImage(finalUrl);
      setPreviewUrl(finalUrl);
      alert('프로필 이미지 업로드 완료!');
    } catch (e) {
      console.error('이미지 업로드 실패: ', e);
      alert('업로드 실패');
    }
  };

  const handleUserInfoUpdate = async () => {
    if (!newNickName.trim()) return alert('닉네임을 입력해주세요.');
    if (!newPassword.trim()) return alert('비밀번호 입력해주세요.');

    try {
      const res = await axios.put(
        `${API_BASE_URL}/user-service/user/update-info`,
        {
          id: userId,
          nickName: newNickName,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          },
        },
      );
      alert('회원정보 수정완료!');
    } catch (e) {
      console.error('회원정보수정실패!', e);
      alert('닉네임 또는 비밀번호 변경 실패');
    }
  };

  return (
    <div className={styles.myPageUser}>
      <div className={styles.profile}>
        <img
          src={previewUrl}
          alt='프로필사진'
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
        <input
          type='file'
          accept='image/*'
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <ul>
          <li>
            현재 닉네임:&nbsp;
            <input type='text' value={userName} readOnly />
          </li>
          <li>
            현재 등급:&nbsp;
            <input type='text' value={badge?.name || ''} readOnly />
          </li>
          <li>
            사용자 상태:&nbsp;
            <input
              type='text'
              value={
                userRole === 'USER'
                  ? '리뷰어'
                  : userRole === 'OWNER'
                    ? '가게사장님'
                    : '관리자'
              }
              readOnly
            />
          </li>
        </ul>
      </div>

      <div className={styles.updateSection}>
        <h3>회원정보 수정</h3>
        <div className={styles.inputGroup}>
          <label htmlFor='newNickName'>새 닉네임</label>
          <input
            id='newNickName'
            type='text'
            value={newNickName}
            onChange={(e) => setNewNickName(e.target.value)}
            placeholder='변경할 닉네임 입력하세요'
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor='newPassword'>새 비밀번호</label>
          <input
            id='newPassword'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='변경할 비밀번호 입력하세요'
          />
        </div>
        <button onClick={handleUserInfoUpdate} className={styles.submitBtn}>
          회원정보 수정
        </button>
      </div>
    </div>
  );
};

export default MyPageUser;
