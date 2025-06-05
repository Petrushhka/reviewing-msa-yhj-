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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.result || []);
    } catch (err) {
      console.error('회원 목록 불러오기 실패:', err);
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
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nickName}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.status || '정상'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlackList;
