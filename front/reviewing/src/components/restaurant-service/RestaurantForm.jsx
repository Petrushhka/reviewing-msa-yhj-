import { useState } from 'react';
import styles from './RestaurantForm.module.scss';

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    for (let img of images) {
      data.append('images', img);
    }

    try {
      const res = await fetch('/restaurant-service/restaurants', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        alert('상점 등록이 완료되었습니다.');
      } else {
        alert('상점 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('에러가 발생했습니다.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>상점 등록</h1>
      <input
        type='file'
        name='images'
        multiple
        accept='image/*'
        onChange={handleFileChange}
        required
      />
      <input
        type='text'
        name='name'
        placeholder='상점 이름을 입력하세요.'
        value={formData.name}
        onChange={handleChange}
        required
      />
      <textarea
        name='description'
        placeholder='상점 소개글을 작성하세요.'
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type='text'
        name='address'
        placeholder='상점 주소를 입력하세요.'
        value={formData.address}
        onChange={handleChange}
        required
      />
      <button type='submit'>등록하기</button>
    </form>
  );
};

export default RestaurantForm;
