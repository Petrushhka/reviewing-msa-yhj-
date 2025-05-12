import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, RESTAURANT_SERVICE } from '../../configs/host-config';

const RestaurantUpdate = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('ACCESS_TOKEN');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data.result;
      setName(data.name || '');
      setPhone(data.phone || '');
      setDescription(data.description || '');
      setAddress(data.address || '');
    } catch (e) {
      console.log(e);
      alert('상점 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('phone', phone);
    data.append('description', description);
    data.append('address', address);

    try {
      const res = await axios.put(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurant/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        alert('상점 수정이 완료되었습니다.');
        navigate(`/restaurantDetail/${id}`);
      } else {
        alert('상점 수정에 실패했습니다.');
      }
    } catch (e) {
      console.log(e);
      alert('에러가 발생했습니다.');
    }
  };

  return (
    <Grid container justifyContent='center' marginTop={'50px'}>
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
          <CardHeader title='상점 수정' style={{ textAlign: 'center' }} />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label='상점명'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='상점 이름을 입력하세요.'
                fullWidth
                margin='normal'
                required
                style={{
                  marginBottom: '30px',
                }}
              />
              <TextField
                label='연락처'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='연락처를 입력하세요.'
                fullWidth
                margin='normal'
                required
                style={{
                  marginBottom: '30px',
                }}
              />
              <TextField
                multiline
                rows={4}
                label='소개글'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='상점 소개글을 작성하세요.'
                fullWidth
                margin='normal'
                required
                style={{
                  marginBottom: '30px',
                }}
              />
              <TextField
                label='상점 주소'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='상점 주소를 입력하세요.'
                fullWidth
                margin='normal'
                required
                style={{
                  marginBottom: '30px',
                }}
              />
              <CardActions>
                <Button
                  type='submit'
                  color='grey'
                  variant='contained'
                  fullWidth
                >
                  수정하기
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RestaurantUpdate;
