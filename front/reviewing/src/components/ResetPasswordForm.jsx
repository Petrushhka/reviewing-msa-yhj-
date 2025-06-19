import axios from 'axios';
import { useState } from 'react';
import { API_BASE_URL, USER_SERVICE } from '../configs/host-config';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function ResetPasswordForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, code } = state || {};
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // 각 필드별 오류 상태 관리
  const [passwordError, setPasswordError] = useState('');
  const [PasswordConfirmError, setPasswordConfirmError] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleReset();
    }
  };

  const handleReset = async () => {
    let isValid = true; // 전체 폼의 유효성을 추적하는 플래그

    // 이전에 설정된 모든 오류 메시지를 초기화합니다.
    setPasswordError('');
    setPasswordConfirmError('');

    // 1) 비밀번호 길이 체크
    if (newPassword.length < 8) {
      setPasswordError('비밀번호는 최소 8자리 이상 입력해주세요.');
      isValid = false;
    }

    // 2) 비밀번호 확인 일치 여부 체크
    else if (!newPasswordConfirm) {
      setPasswordConfirmError('비밀번호를 한 번 더 입력해 주세요.');
      isValid = false;
    }

    // 3) 비밀번호 확인 일치 여부 체크 (confirm에 값이 있을 때만)
    // 이 검사는 두 필드 모두 값이 있고, 비밃런호 길이가 충분할 때만 수행
    else if (
      newPassword &&
      newPasswordConfirm &&
      newPassword !== newPasswordConfirm
    ) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    }

    if (!isValid) {
      return; // 유효성 검사에 실패하면 API 호출 중단
    }

    try {
      await axios.post(`${API_BASE_URL}${USER_SERVICE}/reset-password`, {
        email,
        code,
        newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      setError(
        error.response?.data?.newPassword ||
          error.response?.data?.message ||
          '비밀번호 변경에 실패했습니다.',
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 4,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant='h6' align='center'>
        새 비밀번호 설정
      </Typography>

      <TextField
        type='password'
        label='새 비밀번호'
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          // 사용자 입력 시 비밀번호 필드 관련 오류 초기화
          if (passwordError) setPasswordError('');
        }}
        onKeyDown={handleKeyDown}
        error={Boolean(passwordError)}
        helperText={passwordError}
        fullWidth
      />

      <TextField
        type='password'
        label='새 비밀번호 확인'
        value={newPasswordConfirm}
        onChange={(e) => {
          setNewPasswordConfirm(e.target.value);
          if (PasswordConfirmError) setPasswordConfirmError('');
        }}
        onKeyDown={handleKeyDown}
        error={Boolean(PasswordConfirmError)}
        helperText={PasswordConfirmError}
        fullWidth
      />

      <Button
        type='submit'
        variant='contained'
        color='primary'
        onClick={handleReset}
        fullWidth
        sx={{ mt: 1 }}
      >
        비밀번호 변경
      </Button>
    </Box>
  );
}
