import { useState, useMemo } from 'react';
import styles from './ExperienceSearch.module.scss';

/* ✅ 체험단 더미 데이터 */
const dummyData = [
  {
    id: 1,
    title: '핸드드립 원데이 클래스',
    place: '서울 마포',
    deadline: '모집 ~ 5/31',
    imageUrl:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80',
  },
  {
    id: 2,
    title: '도자기 빚기 체험',
    place: '경기 고양',
    deadline: '모집 ~ 6/05',
    imageUrl: 'https://picsum.photos/seed/experience2/800/600',
  },
  {
    id: 3,
    title: '반려견 수제간식 클래스',
    place: '부산 해운대',
    deadline: '모집 ~ 6/10',
    imageUrl: 'https://picsum.photos/seed/experience3/800/600',
  },
  {
    id: 4,
    title: '라탄 트레이 만들기',
    place: '서울 강동',
    deadline: '모집 ~ 6/12',
    imageUrl: 'https://picsum.photos/seed/experience4/800/600',
  },
  {
    id: 5,
    title: '플라워 레슨',
    place: '경기 분당',
    deadline: '모집 ~ 6/15',
    imageUrl:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80',
  },
  {
    id: 6,
    title: '와인 테이스팅 파티',
    place: '서울 종로',
    deadline: '모집 ~ 6/18',
    imageUrl: 'https://picsum.photos/seed/experience5/800/600',
  },
  {
    id: 7,
    title: '천연 비누 공방 체험',
    place: '대전 서구',
    deadline: '모집 ~ 6/20',
    imageUrl: 'https://picsum.photos/seed/experience7/800/600',
  },
  {
    id: 8,
    title: '수제 버거 쿠킹 클래스',
    place: '인천 송도',
    deadline: '모집 ~ 6/22',
    imageUrl:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
  },
  {
    id: 9,
    title: '사진 필름 현상 워크숍',
    place: '광주 동구',
    deadline: '모집 ~ 6/25',
    imageUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  },
  {
    id: 10,
    title: '서핑 입문 클래스',
    place: '강원 양양',
    deadline: '모집 ~ 6/28',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  },
  {
    id: 11,
    title: '캠핑·불멍 체험',
    place: '경북 경주',
    deadline: '모집 ~ 7/01',
    imageUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  },
  {
    id: 12,
    title: '목공 DIY 스툴 만들기',
    place: '전주 완산',
    deadline: '모집 ~ 7/03',
    imageUrl:
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80',
  },
  {
    id: 13,
    title: '도심 한강 카약',
    place: '서울 여의도',
    deadline: '모집 ~ 7/05',
    imageUrl: 'https://picsum.photos/seed/experience11/800/600',
  },
  {
    id: 14,
    title: '수채화 원데이 클래스',
    place: '울산 남구',
    deadline: '모집 ~ 7/07',
    imageUrl: 'https://picsum.photos/seed/experience8/800/600',
  },
  {
    id: 15,
    title: '로스팅 체험 · 내 커피 만들기',
    place: '부산 기장',
    deadline: '모집 ~ 7/10',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  },
  {
    id: 16,
    title: '패들보드 SUP',
    place: '제주 구좌',
    deadline: '모집 ~ 7/12',
    imageUrl: 'https://picsum.photos/seed/experience12/800/600',
  },
  {
    id: 17,
    title: '블렌딩 티 클래스',
    place: '서울 성수',
    deadline: '모집 ~ 7/15',
    imageUrl:
      'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=800&q=80',
  },
  {
    id: 18,
    title: 'VR·AR 콘텐츠 체험',
    place: '세종 금남',
    deadline: '모집 ~ 7/17',
    imageUrl: 'https://picsum.photos/seed/experience13/800/600',
  },
  {
    id: 19,
    title: '라라랜드 댄스 워크숍',
    place: '대구 수성',
    deadline: '모집 ~ 7/20',
    imageUrl:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
  },
  {
    id: 20,
    title: '클라이밍 입문 체험',
    place: '경기 안산',
    deadline: '모집 ~ 7/23',
    imageUrl:
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
  },
];

function ExperienceSearch() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('');
  const [theme, setTheme] = useState('');

  /* 🔍 필터링 */
  const filteredData = useMemo(() => {
    return dummyData.filter(({ title, place }) => {
      const kw = keyword.trim().toLowerCase();
      const byKeyword = !kw || title.toLowerCase().includes(kw);
      const byRegion = !region || place.includes(region);
      const byTheme = !theme || title.includes(theme);
      return byKeyword && byRegion && byTheme;
    });
  }, [keyword, region, theme]);

  return (
    <div className={styles.wrapper}>
      {/* 검색 바 */}
      <div className={styles.searchBar}>
        <input
          placeholder='키워드로 체험단 검색...'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* (선택) 지역·테마 필터 – 데모용 간단 Select */}
      <div className={styles.filters}>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value=''>전체 지역</option>
          <option value='서울'>서울</option>
          <option value='경기'>경기</option>
          <option value='부산'>부산</option>
        </select>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value=''>전체 테마</option>
          <option value='클래스'>클래스</option>
          <option value='체험'>체험</option>
          <option value='간식'>간식</option>
        </select>
      </div>

      {/* 카드 그리드 */}
      <div className={styles.grid}>
        {filteredData.map((card) => (
          <div key={card.id} className={styles.card}>
            <img src={card.imageUrl} alt={card.title} />
            <div className={styles.info}>
              <h4>{card.title}</h4>
              <div className={styles.meta}>
                <span>{card.place}</span> · <span>{card.deadline}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <p className={styles.empty}>조건에 맞는 체험단이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ExperienceSearch;
