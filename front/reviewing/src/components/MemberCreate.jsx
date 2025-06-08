import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { API_BASE_URL, USER_SERVICE } from '../configs/host-config';
import AuthContext from '../context/UserContext';
import axios from 'axios';

const MemberCreate = () => {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // 이메일 인증 관련 상태
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    alert('이미 로그인되어 있습니다.');
    navigate('/', replace);
  }

  const sendVerificationEmail = async () => {
    console.log('이메일 인증 버튼이 클릭됨!');
    if (!email) {
      alert('이메일을 먼저 입력해 주세요!');
      return;
    }

    const regEmail =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    // 정규표현식 작성 후 변수에 대입해 주면, 정규표현식을 담은 객체로 저장이 됩니다.
    // 해당 정규표현식 객체는 test 메서드를 통해, 전달된 값이 정규표현식에 일치하는 값인지를 검증하는 로직을 제공.
    if (!regEmail.test(email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setEmailSendLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}${USER_SERVICE}/email-valid`,
        {
          email,
        },
      );
      console.log('응답된 결과: ', res.data);

      setIsEmailSent(true); // 인증 코드를 입력할 수 있는 필드를 드러내자.
      alert('인증 코드가 이메일로 발송되었습니다.');
    } catch (error) {
      console.error('이메일 인증 요청 실패:', error);
      alert('메일 전송 중 오류가 발생했습니다.');
    } finally {
      setEmailSendLoading(false); // 전송되든 에러가 나든 로딩이 끝났음을 알려주기.
    }
  };

  const verifyEmailCode = async () => {
    if (!verificationCode.trim()) {
      alert('인증 코드를 입력해 주세요!');
      return;
    }
    setVerifyLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}${USER_SERVICE}/verify`, {
        email,
        code: verificationCode,
      });

      console.log('응답된 데이터: ', res.data);
      setIsEmailVerified(true);
      alert('이메일 인증이 완료되었습니다!');
    } catch (error) {
      console.error('인증 확인 오류: ', error);
      const msg = error.response.data.statusMessage;
      if (msg === 'authCode expired!') {
        alert('인증 시간이 만료되었습니다. 인증 코드부터 다시 발급해 주세요!');
      } else if (msg == 'email blocked!') {
        alert('인증 횟수가 초과 되었습니다. 30분 뒤 다시 인증하세요');
      } else if (msg.indexOf('wrong') !== -1) {
        const remaining = parseInt(msg.split(', ')[1], 10);

        if (remaining > 0) {
          alert(`인증 코드가 올바르지 않습니다!, 남은 횟수: ${remaining}`);
        }
      } else {
        alert('시스템 문제 발생! 관리자에게 문의하세요!');
      }
    } finally {
      setVerifyLoading(false);
    }
  };

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
      <Grid item xs={12} sm={10} md={8}>
        <Card
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
            width: '120%',
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
              {/* 이메일 필드와 인증 버튼 */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  label='Email'
                  type='email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // 이메일이 변경되면 인증 상태 초기화
                    if (isEmailSent || isEmailVerified) {
                      setIsEmailSent(false);
                      setIsEmailVerified(false);
                    }
                  }}
                  fullWidth
                  margin='normal'
                  required
                  // sx={{
                  //   '& .MuiInputBase-root': {
                  //     backgroundColor: isEmailVerified ? '#f5f5f5' : 'inherit',
                  //   },
                  // }}
                />
                <Button
                  variant='outlined'
                  onClick={sendVerificationEmail}
                  sx={{ mb: 1, minWidth: '60px' }}
                >
                  {emailSendLoading
                    ? '발송중...'
                    : isEmailVerified
                      ? '인증완료'
                      : '인증'}
                </Button>
              </Box>
              {/* 인증 코드 입력 필드 */}
              {isEmailSent && !isEmailVerified && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    label='인증 코드'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    fullWidth
                    margin='normal'
                    placeholder='이메일로 받은 인증 코드를 입력하세요'
                  />
                  <Button
                    variant='outlined'
                    onClick={verifyEmailCode}
                    disabled={!verificationCode || verifyLoading}
                    sx={{ mb: 1, minWidth: '60px' }}
                  >
                    {verifyLoading ? '확인중...' : '확인'}
                  </Button>
                </Box>
              )}

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
                  sx={{ background: 'peru' }}
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
