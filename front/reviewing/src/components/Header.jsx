import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  Autocomplete,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/UserContext';
import BadgeProgressModal from './BadgeProgressModal';
import { API_BASE_URL } from '../configs/host-config';

const sampleOptions = ['리액트', '스프링 부트', 'JPA', 'MSA', 'JWT'];

const Header = () => {
  const { isLoggedIn, onLogout, userRole, userName, badge, userId, isInit } =
    useContext(AuthContext);
  console.log('🧩 badge:', badge);
  console.log('🧩 badge.level:', badge?.level);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [progress, setProgress] = useState(null);
  const [open, setOpen] = useState(false);

  const handleBadgeClick = async () => {
    console.log('🔥 배지 클릭됨');
    try {
      const res = await axios.get(
        `${API_BASE_URL}/badges/user/${userId}/progress`,
      );
      console.log('✅ progress API 응답:', res.data);
      setProgress(res.data.result);
    } catch (err) {
      console.error('❌ 배지 진행 상태 조회 실패:', err);
      setProgress({
        currentPoint: 0,
        currentLevel: '없음',
        nextLevel: '입문자',
        pointsToNextLevel: 0,
      });
    }
    setOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('검색어:', searchValue);
    // navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position='fixed'
        color='white'
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#ffffff',
        }}
      >
        <Toolbar>
          <Container maxWidth={false} disableGutters>
            <Grid
              container
              alignItems='center'
              justifyContent='space-between'
              sx={{ px: 2 }}
            >
              {/* 왼쪽: 로고 + 검색창 */}
              <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  color='inherit'
                  component={Link}
                  to='/'
                  disableRipple // 물결 효과 제거
                  sx={{
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'transparent', // hover 배경 제거
                    },
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 'bold',
                      color: 'peru',
                      fontFamily: 'Lobster, cursive',
                      textDecoration: 'none',
                    }}
                  >
                    리뷰킹
                  </Typography>
                </Button>

                <Box
                  component='form'
                  onSubmit={handleSearchSubmit}
                  sx={{ width: 300 }}
                >
                  <Autocomplete
                    freeSolo
                    options={sampleOptions}
                    inputValue={searchValue}
                    onInputChange={(e, v) => setSearchValue(v)}
                    filterOptions={(x) => x}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder='검색어를 입력하세요'
                        size='small'
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <IconButton type='submit' sx={{ p: 0.5 }}>
                              <SearchIcon />
                            </IconButton>
                          ),
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'peru', // 기본 테두리 색
                              borderWidth: '1px',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'peru', // 마우스 올렸을 때
                              borderWidth: '1px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'peru', // 포커스 되었을 때
                              borderWidth: '1px',
                            },
                            transition: 'box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              {/* 중앙: 관리자 메뉴 */}
              {userRole === 'ADMIN' && (
                <Grid item>
                  <Button color='inherit' component={Link} to='/member/list'>
                    회원관리
                  </Button>
                  <Button color='inherit' component={Link} to='/product/manage'>
                    가게등록
                  </Button>
                  <Button color='inherit' component={Link} to='/order/list'>
                    실시간 주문
                  </Button>
                </Grid>
              )}

              {/* 오른쪽: 유저 정보 */}
              <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Stack direction='row' spacing={1}>
                  {[
                    { label: '체험단 등록', to: '/sass' },
                    { label: '커뮤니티', to: '/badges' },
                    { label: '공지/이벤트', to: '/collapsible' },
                    { label: '이용가이드', to: '/collapsible' },
                  ].map(({ label, to }) => (
                    <Button
                      key={label}
                      color='inherit'
                      component={Link}
                      to={to}
                      disableRipple // 물결 효과 제거
                      sx={{
                        backgroundColor: 'transparent',
                        fontFamily: 'inherit',
                        fontWeight: 400,
                        color: '#4B4B4B',
                        '&:hover': {
                          backgroundColor: 'transparent', // 배경 고정
                          color: 'rgba(0, 0, 0, 0.6)', // 글씨만 살짝 연하게
                        },
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </Stack>

                {isLoggedIn ? (
                  <>
                    <Typography
                      component={Link}
                      to='/mypage'
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontFamily: 'Lobster, cursive',
                        fontWeight: 500,
                        color: '#5A4FCF',
                        letterSpacing: '0.5px',
                        textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
                        transition: 'color 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: '#7D6EFF',
                        },
                      }}
                    >
                      {userName}님
                    </Typography>
                    {isInit && badge?.level && (
                      <img
                        src={`/icons/${badge.level.toLowerCase()}.png`}
                        alt={badge.badgeName || '기본 뱃지'}
                        onClick={handleBadgeClick}
                        style={{
                          width: 24,
                          cursor: 'pointer',
                          marginLeft: '-15px',
                        }}
                      />
                    )}
                    <Button
                      color='inherit'
                      onClick={handleLogout}
                      sx={{
                        backgroundColor: 'transparent',
                        fontFamily: 'inherit',
                        fontWeight: 400,
                        color: '#4B4B4B',
                        '&:hover': {
                          backgroundColor: 'transparent', // 배경 고정
                          color: 'rgba(0, 0, 0, 0.6)', // 글씨만 살짝 연하게
                        },
                      }}
                    >
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to='/member/create'
                      sx={{
                        color: '#blue',
                        fontWeight: 500,
                      }}
                    >
                      회원가입
                    </Button>
                    <Button
                      component={Link}
                      to='/login'
                      sx={{
                        color: '#blue',
                        fontWeight: 500,
                      }}
                    >
                      로그인
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: '64px' }} />

      {/* 배지 진행률 모달 */}
      <BadgeProgressModal
        open={open}
        onClose={() => setOpen(false)}
        progress={progress}
      />
    </>
  );
};

export default Header;
