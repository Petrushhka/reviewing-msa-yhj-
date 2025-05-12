import { useContext } from 'react';
import MyPageOwner from './MyPageOwner';
import MyPageUser from './MyPageUser';
import AuthContext from '../context/UserContext';

const MyPage = () => {
  const { userRole } = useContext(AuthContext);

  return (
    <>
      {userRole === 'OWNER' && <MyPageOwner />}
      {userRole === 'USER' && <MyPageUser />}
      {!userRole && <div>로그인 후 사용하시기 바랍니다.</div>}
    </>
  );
};

export default MyPage;
