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
import { useState } from 'react';
import { API_BASE_URL, RESTAURANT_SERVICE } from '../../configs/host-config';
import { useNavigate } from 'react-router-dom';

const RestaurantForm = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    const data = new FormData();
    data.append('userId', localStorage.getItem('USER_ID'));
    data.append('name', name);
    data.append('phone', phone);
    data.append('description', description);
    data.append('address', address);

    for (let img of images) {
      data.append('images', img);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}${RESTAURANT_SERVICE}/restaurants`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 201) {
        alert('상점 등록이 완료되었습니다.');
        navigate('/');
      } else {
        alert('상점 등록에 실패했습니다.');
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
          <CardHeader title='상점 등록' style={{ textAlign: 'center' }} />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <input
                type='file'
                name='images'
                multiple
                accept='image/*'
                onChange={handleFileChange}
                required
                style={{
                  marginBottom: '30px',
                }}
              />
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

export default RestaurantForm;
