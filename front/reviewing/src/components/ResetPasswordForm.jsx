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
  const [error, setError] = useState('');

  const handleReset = async () => {
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
          if (error) setError('');
        }}
        error={Boolean(error)}
        helperText={error}
        fullWidth
      />

      <Button
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
