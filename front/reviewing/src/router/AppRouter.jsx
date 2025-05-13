import React, { useContext } from 'react';
import Home from '../components/Home';
import MemberCreate from '../components/MemberCreate';
import LoginPage from '../components/LoginPage';
import { Route, Routes } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import ReviewCard from '../components/review-service/ReviewCard';
import ReviewSection from '../components/review-service/ReviewSection';
import RestaurantForm from '../components/restaurant-service/RestaurantForm';
import RestaurantDetail from '../components/restaurant-service/RestaurantDetail';
import RestaurantUpdate from '../components/restaurant-service/RestaurantUpdate';
import RestaurantList from '../components/restaurant-service/RestaurantList';
import MyPage from '../user-service/MyPage';
import AuthContext from '../context/UserContext';
import Community from '../components/source/Community';
import NoticeEvent from '../components/source/NoticeEvent';

const AppRouter = () => {
  const { userRole } = useContext(AuthContext); // private 라우터를 이용하기 위해 추가(하준)

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/member/create' element={<MemberCreate />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/review' element={<ReviewSection userId={7} />} />
      <Route path='/restaurantForm' element={<RestaurantForm />} />
      <Route path='/restaurant/list' element={<RestaurantList />} />
      <Route path='/restaurantDetail' element={<RestaurantDetail />} />
      <Route path='/restaurantUpdate' element={<RestaurantUpdate />} />
      <Route
        path='/mypage'
        element={<PrivateRouter element={<MyPage />} requiredRole={userRole} />}
      />
      <Route path='/restaurantDetail/:id' element={<RestaurantDetail />} />
      <Route path='/restaurantUpdate/:id' element={<RestaurantUpdate />} />
      <Route path='/coummunity' element={<Community />} />
      <Route path='/noticeEvent' element={<NoticeEvent />} />
      {/* <Route path='/mypage' element={<PrivateRouter element={<MyPage />} />} /> */}
    </Routes>
  );
};

export default AppRouter;
