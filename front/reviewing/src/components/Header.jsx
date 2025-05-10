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
      <AppBar position='static' color='default' elevation={1}>
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
                <Button color='inherit' component={Link} to='/'>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    PlayData
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
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <IconButton type='submit' sx={{ p: 0.5 }}>
                              <SearchIcon />
                            </IconButton>
                          ),
                        }}
                        fullWidth
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
                  <Button color='inherit' component={Link} to='/sass'>
                    체험단 등록
                  </Button>
                  <Button color='inherit' component={Link} to='/badges'>
                    커뮤니티
                  </Button>
                  <Button color='inherit' component={Link} to='/collapsible'>
                    공지/이벤트
                  </Button>
                  <Button color='inherit' component={Link} to='/collapsible'>
                    이용가이드
                  </Button>
                </Stack>

                {isLoggedIn ? (
                  <>
                    <Typography
                      component={Link}
                      to='/mypage'
                      sx={{
                        cursor: 'pointer',
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
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
                    <Button color='inherit' onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color='inherit'
                      component={Link}
                      to='/member/create'
                    >
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
