import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Grid,
  TextField,
} from '@mui/material';
import styles from './MyPageUser.module.scss';
import { useContext } from 'react';
import AuthContext from '../context/UserContext';

const MyPageUser = () => {
  const { userRole, userName, badge, userId, userImage } =
    useContext(AuthContext);

  console.log('userimage' + userImage);

  return (
    <>
      <div className={styles.myPageUser}>
        <div className={styles.profile}>
          <img vsrc={userImage} alt='프로필사진' />
          <ul>
            <li>
              닉네임:&nbsp;
              <input type='text' value={userName} />
            </li>
            <li>
              현재등급:&nbsp;
              <input type='text' value={badge} />
            </li>
            <li>
              사용자가입상태:&nbsp;
              <input
                type='text'
                value={
                  userRole === 'USER'
                    ? '리뷰어'
                    : userRole === 'OWNER'
                      ? '가게사장님'
                      : '관리자'
                }
                readOnly
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyPageUser;
