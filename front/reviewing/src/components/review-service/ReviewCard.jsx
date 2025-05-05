import React from 'react';
import StarSvg from './StarSvg';

const ReviewCard = () => {
  return (
    <>
      <div className='entire-wrap'>
        <div className='profile-wrap'>
          <div className='profile-image'></div>
          <div className='profile-info'>
            <div className='nickname'>녹색걷기</div>
            <div className='detailed-info'>
              <span>지역 가이드 리뷰 3,172개 사진 44831장</span>
            </div>
          </div>
          <div className='option'></div>
        </div>
        <div className='sup-top-wrap'>
          <div className='rating'>
            <span>
              <div style={{ display: 'flex' }}>
                <StarSvg isGold={true} />
                <StarSvg isGold={true} />
                <StarSvg isGold={true} />
                <StarSvg isGold={false} />
                <StarSvg isGold={false} />
              </div>
            </span>
          </div>
          <div className='uploaded-date'>2018.05.05</div>
        </div>
        <div className='content-wrap'>
          <p>
            버스도 꽤 많고 좋아요. 시설은 그냥 무난한데 화장실이나 몇몇 시설들을
            깜끔하게 보수했으면 합니다.
          </p>
        </div>
        <div className='image-wrap'></div>
        <div className='sup-bottom-wrap'></div>
      </div>
    </>
  );
};

export default ReviewCard;
