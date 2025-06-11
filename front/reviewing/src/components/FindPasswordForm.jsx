import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, USER_SERVICE } from '../configs/host-config';
import { Box, Button, TextField } from '@mui/material';

export default function FindPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    let newErrors = {};

    // 1) 이메일이 비어있는지 체크
    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    }

    // 2) 이메일 형식 검증
    else {
      const regEmail =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!regEmail.test(email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다.';
      }
    }

    // 에러가 하나라도 있다면 여기서 중단하고 에러 상태를 업데이트
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}${USER_SERVICE}/find-password`, {
        email,
      });
      // 다음 스텝으로 이동(예: navigate('/verify-code'))
      navigate('/verify-code', { state: { email } });
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors(error.response.data);
      } else {
        setErrors({ email: '서버 에러가 발생했습니다.' });
      }
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 10 }}
    >
      <TextField
        label='이메일'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          // 입력값이 변경되면 이메일 필드 관련 에러 메시지를 지웁니다.
          if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
          }
        }}
        error={Boolean(errors.email)}
        helperText={errors.email}
        fullWidth
        margin='normal'
      />
      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        sx={{ mt: 2 }}
      >
        인증 코드 발송
      </Button>
    </Box>
  );
}
