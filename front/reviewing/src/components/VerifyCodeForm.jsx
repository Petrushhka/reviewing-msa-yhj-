import axios from 'axios';
import { useState } from 'react';
import { API_BASE_URL, USER_SERVICE } from '../configs/host-config';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function VerifyCodeForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email } = state || {};
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      await axios.post(`${API_BASE_URL}${USER_SERVICE}/verify-code`, {
        email,
        code,
      });
      // 검증 통과하면 새 비밀번호 화면으로
      navigate('/reset-password', { state: { email, code } });
    } catch (error) {
      setError(error.response?.data?.code || '인증에 실패했습니다.');
    }
  };

  return (
    <Box
      margin={'70px'}
      sx={{
        maxWidth: 300,
        width: '100%',
        mx: 'auto',
        mt: 8,
        p: 2,
      }}
    >
      <Typography variant='h6' align='center' margin={'15px'}>
        인증 코드 입력
      </Typography>
      <Stack spacing={3}>
        <TextField
          label='인증 코드'
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
          }}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
        <Button
          variant='contained'
          onClick={handleVerify}
          fullWidth
          sx={{ py: 1.5 }}
        >
          인증 확인
        </Button>
      </Stack>
    </Box>
  );
}
