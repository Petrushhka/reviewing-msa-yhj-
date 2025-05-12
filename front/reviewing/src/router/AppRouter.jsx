import React from 'react';
import Home from '../components/Home';
import MemberCreate from '../components/MemberCreate';
import LoginPage from '../components/LoginPage';
// import MyPage from '../components/MyPage';
import { Route, Routes } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import ReviewCard from '../components/review-service/ReviewCard';
import ReviewSection from '../components/review-service/ReviewSection';
import RestaurantForm from '../components/restaurant-service/RestaurantForm';
import RestaurantDetail from '../components/restaurant-service/RestaurantDetail';
import RestaurantUpdate from '../components/restaurant-service/RestaurantUpdate';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/member/create' element={<MemberCreate />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/review' element={<ReviewSection />} />
      <Route path='/restaurantForm' element={<RestaurantForm />} />
      <Route path='/restaurantDetail/:id' element={<RestaurantDetail />} />
      <Route path='/restaurantUpdate/:id' element={<RestaurantUpdate />} />
      {/* <Route path='/mypage' element={<PrivateRouter element={<MyPage />} />} /> */}
    </Routes>
  );
};

export default AppRouter;
