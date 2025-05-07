import {
  AppBar,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext';

const Header = () => {
  const { isLoggedIn, onLogout, userRole, userName } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    alert('로그아웃 완료!');
    navigate('/login');
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Container maxWidth={false} disableGutters>
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            style={{ padding: '0 16px' }}
          >
            {/* 왼쪽: 로고 */}
            <Grid item>
              <Button color='inherit' component={Link} to='/'>
                <Typography variant='h6'>PlayData</Typography>
              </Button>
            </Grid>

            {/* 가운데: 관리자 메뉴 (ADMIN인 경우만 표시) */}
            {userRole === 'ADMIN' && (
              <Grid item>
                <Button color='inherit' component={Link} to='/member/list'>
                  회원관리
                </Button>
                <Button color='inherit' component={Link} to='/product/manage'>
                  상품관리
                </Button>
                <Button color='inherit' href='/order/list'>
                  실시간 주문 ()
                </Button>
              </Grid>
            )}

            {/* 오른쪽: 로그인/로그아웃 */}
            <Grid
              item
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              {isLoggedIn ? (
                <>
                  <Typography>{userName}님</Typography>
                  <Button color='inherit' onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button color='inherit' component={Link} to='/member/create'>
                    회원가입
                  </Button>
                  <Button color='inherit' component={Link} to='/login'>
                    로그인
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
