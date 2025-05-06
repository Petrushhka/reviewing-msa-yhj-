import React from 'react';
import Home from '../components/Home';
import MemberCreate from '../components/MemberCreate';
import LoginPage from '../components/LoginPage';
// import MyPage from '../components/MyPage';
import { Route, Routes } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import ReviewCard from '../components/review-service/ReviewCard';
import ReviewSection from '../components/review-service/ReviewSection';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/member/create' element={<MemberCreate />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/review' element={<ReviewSection />} />
      {/* <Route path='/mypage' element={<PrivateRouter element={<MyPage />} />} /> */}
    </Routes>
  );
};

export default AppRouter;
