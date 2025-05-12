import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { API_BASE_URL, USER_SERVICE } from '../configs/host-config';
import AuthContext from '../context/UserContext';

const MemberCreate = () => {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    alert('이미 로그인되어 있습니다.');
    navigate('/', replace);
  }

  const memberCreate = async (e) => {
    e.preventDefault();

    const registData = {
      nickName,
      email,
      password,
      role,
    };

    const res = await fetch(`${API_BASE_URL}${USER_SERVICE}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(registData),
    });

    const data = await res.json();
    if (data.statusCode === 201) {
      alert(`${data.result}님 환영합니다!`);
      navigate('/');
    } else {
      alert(data.statusMessage || '회원가입에 실패했습니다.');
    }
  };

  return (
    <Grid container justifyContent='center' marginTop='50px'>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            maxWidth: 500,
            margin: '0 auto',
            padding: 2,
            border: '2px solid rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <CardHeader title='회원가입' style={{ textAlign: 'center' }} />
          <CardContent>
            <form onSubmit={memberCreate}>
              <TextField
                label='닉네임'
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                fullWidth
                margin='normal'
                required
              />
              <TextField
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin='normal'
                required
              />
              <TextField
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
                inputProps={{ minLength: 8 }}
              />
              <TextField
                label='회원 권한'
                select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                margin='normal'
                required
              >
                <MenuItem value=''>선택하세요</MenuItem>
                <MenuItem value='USER'>리뷰 작성자</MenuItem>
                <MenuItem value='OWNER'>사업자</MenuItem>
              </TextField>
              <CardActions>
                <Button
                  type='submit'
                  color='primary'
                  variant='contained'
                  fullWidth
                >
                  등록
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MemberCreate;
