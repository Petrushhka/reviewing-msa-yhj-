import styles from './Community.module.scss';
import { useState } from 'react';

const dummyPosts = [
  {
    id: 1,
    author: '재윤',
    content: '오늘 날씨 정말 좋네요! 🌤️',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/zzae_zze/post/d5facfea-02b0-4bc1-a59a-bb214371b6da/image.png',
    likes: 15,
    comments: 4,
  },
  {
    id: 2,
    author: '민경찬',
    content: '리액트 배우는 중인데 재밌어요! 📚',
    date: '2025-05-12',
    imageUrl:
      'https://velog.velcdn.com/images/joch2712/post/7a8ce737-5c82-48eb-8683-d37b1942bbcd/image.png',
    likes: 22,
    comments: 8,
  },
  {
    id: 3,
    author: 'TapK',
    content: '좋은 맛집 추천해주세요~ 🍜',
    date: '2025-05-11',
    imageUrl:
      'https://velog.velcdn.com/images/tap_kim/post/5d42addc-4fa6-4eef-a875-c5a573265903/image.jpeg',
    likes: 34,
    comments: 12,
  },
  {
    id: 4,
    author: 'eunbinn',
    content: '벚꽃이 만개했어요! 🌸',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/eunbinn/post/d1561930-2e0f-428d-a1c7-d8c522978d9d/image.png',
    likes: 45,
    comments: 7,
  },
  {
    id: 5,
    author: 'osohyun0224',
    content: '새 프로젝트 시작했습니다! 🚀',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/osohyun0224/post/0f9ad29a-c811-4ddc-aad0-7a81ae474bc9/image.png',
    likes: 30,
    comments: 10,
  },
  {
    id: 6,
    author: '그랴',
    content: '야경 보러 갑시다! 🌃',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/innerstella/post/fa61a70e-8026-46c5-ae92-e3b955061d5e/image.png',
    likes: 18,
    comments: 3,
  },
  {
    id: 7,
    author: '인디해커',
    content: '맛있는 저녁 드세요! 🍽️',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/hello1234/post/014c08f7-c9b3-466e-9c02-6093b6ccad5b/image.jpg',
    likes: 12,
    comments: 2,
  },
  {
    id: 8,
    author: '왓에버',
    content: '달리기 5km 성공! 🏃‍♀️',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/whatever/post/175186fe-68aa-46e8-b598-f67fd629f24d/image.png',
    likes: 27,
    comments: 6,
  },
  {
    id: 9,
    author: '원정',
    content: '오늘 독서 완료! 📚',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/jang_expedition/post/8fb6fc0e-9ab2-418a-8e9e-24572d06bd04/image.jpg',
    likes: 19,
    comments: 2,
  },
  {
    id: 10,
    author: 'saewoohan',
    content: '운동 끝! 근육통 올 듯... 💪',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/saewoohan/post/19bbf8ee-9073-4b84-8cc2-76cca8a4659b/image.png',
    likes: 34,
    comments: 8,
  },
  {
    id: 11,
    author: '최기환',
    content: '새 신발 자랑합니다! 👟',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/hello1234/post/2eadead3-7982-44dc-9c81-ccb1ff2f9702/image.png',
    likes: 16,
    comments: 3,
  },
  {
    id: 12,
    author: '양예성',
    content: '코딩 중... 집중! 👨‍💻',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/koreanthuglife/post/4736569e-e1cc-468f-b152-89b345bda123/image.png',
    likes: 21,
    comments: 5,
  },
  {
    id: 13,
    author: '최씨',
    content: '케이크 너무 맛있어요! 🎂',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/yeseong0412/post/93696123-9c4c-4ef4-a042-346e1f5dbecf/image.png',
    likes: 14,
    comments: 2,
  },
  {
    id: 14,
    author: '데브현',
    content: '여행 가고 싶다! ✈️',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/chlruddlf73/post/8439f678-c50c-4a27-866d-224ee1953311/image.png',
    likes: 32,
    comments: 9,
  },
  {
    id: 15,
    author: '신민수',
    content: '고양이랑 놀기! 🐱',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/haryan248/post/57801a03-721a-4cd3-b72f-ac2c87a42d41/image.png',
    likes: 25,
    comments: 4,
  },
  {
    id: 16,
    author: 'cindycho_0423',
    content: '새벽 감성... 🌙',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/shinminsoo317/post/2bfebb8b-21ae-45d4-8add-eececffbe599/image.jpg',
    likes: 17,
    comments: 3,
  },
  {
    id: 17,
    author: '송선권',
    content: '간단한 요리 완성! 🍳',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/skynet/post/3986b28b-89f4-4f2f-a90d-061cd672f759/image.png',
    likes: 22,
    comments: 6,
  },
  {
    id: 18,
    author: 'ant',
    content: '오늘도 화이팅! 💪',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/cindycho0423/post/e786a48c-628d-4533-a4f8-976e72c437f8/image.png',
    likes: 28,
    comments: 7,
  },
  {
    id: 19,
    author: '김수인',
    content: '아이스크림 먹는 중! 🍦',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/songsunkook/post/efb474e6-2845-4d07-9431-313d1659309d/image.png',
    likes: 19,
    comments: 2,
  },
  {
    id: 20,
    author: '홍규진',
    content: '독서하기 좋은 날 📖',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/rewq5991/post/1c9b03b5-9e73-4c38-abd5-e1aff5fecee1/image.png',
    likes: 24,
    comments: 5,
  },
  {
    id: 21,
    author: '서희찬',
    content: '오늘의 운동 완료! 🏋️‍♂️',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/suinkim/post/5d40416f-845e-494b-9ee7-24beedbcb7fe/image.png',
    likes: 26,
    comments: 8,
  },
  {
    id: 22,
    author: 'ClydeHan',
    content: '햇살 가득한 오후 🌞',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/kyujenius/post/962d304c-f0f9-4348-8098-dd55cf9fd2b5/image.png',
    likes: 30,
    comments: 9,
  },
  {
    id: 23,
    author: '권민재',
    content: '커피 타임! ☕',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/seochan99/post/97945fd6-62be-4f51-bbba-6cc68988bad7/image.png',
    likes: 15,
    comments: 3,
  },
  {
    id: 24,
    author: 'Hunn',
    content: '봄바람이 솔솔~ 🌼',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/clydehan/post/e5e887fe-634a-4ef0-90fd-caa1295df286/image.png',
    likes: 20,
    comments: 4,
  },
  {
    id: 25,
    author: 'Yehyeok Bang',
    content: '도시 야경 최고! 🌃',
    date: '2025-05-13',
    imageUrl:
      'https://velog.velcdn.com/images/kwon5700/post/4348e5f9-6c6e-47df-bba0-28c72826f826/image.png',
    likes: 18,
    comments: 2,
  },
];

const Community = () => {
  const [posts, setPosts] = useState(dummyPosts);

  const handleLike = (postId) => {
    const updated = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post,
    );
    setPosts(updated);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>리뷰킹 커뮤니티</h2>
      <div className={styles.postList}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.header}>
              <span className={styles.author}>{post.author}</span>
              <span className={styles.date}>{post.date}</span>
            </div>
            <img
              src={post.imageUrl}
              alt='게시 이미지'
              className={styles.postImage}
            />
            <p className={styles.content}>{post.content}</p>
            <div className={styles.actions}>
              <button onClick={() => handleLike(post.id)}>
                ❤️ {post.likes}
              </button>
              <span>💬 {post.comments} 댓글</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
