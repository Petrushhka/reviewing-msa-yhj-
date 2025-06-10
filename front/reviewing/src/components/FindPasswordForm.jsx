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
        alert('서버 에러가 발생했습니다.');
      }
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}
    >
      <TextField
        label='이메일'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
