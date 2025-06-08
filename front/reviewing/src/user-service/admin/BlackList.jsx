// BlackList.jsx (운영자 회원 목록 관리 페이지)
import styles from './BlackList.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/host-config';

const BlackList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const token = localStorage.getItem('ACCESS_TOKEN');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user-service/user-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error('회원 목록 불러오기 실패:', err);
    }
  };

  const changeStatus = async (user) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/user-service/change-status`,
        {
          userEmail: user.email,
          isBlack: user.isBlack,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, isBlack: !u.isBlack } : u,
      );
      setUsers(updatedUsers);
    } catch (e) {
      console.error('실패', e);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.nickName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.adminUserList}>
      <h2>회원 목록 관리</h2>
      <div className={styles.searchBox}>
        <input
          type='text'
          placeholder='닉네임으로 검색'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>아이디</th>
            <th>닉네임</th>
            <th>역할</th>
            <th>이메일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody className={styles.userList}>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nickName}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td
                className={`${styles.status} ${user.isBlack ? styles.status_blocked : ''}`}
                onClick={() => changeStatus(user)}
              >
                {user.isBlack ? '정지' : '정상'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlackList;
