import React, { useEffect, useRef, useState } from 'react';

const CLIENT_ID = 'd5o30v9dw7';

export default function NaverMapComponent({
  address,
  width = '500px',
  height = '500px',
}) {
  const [loaded, setLoaded] = useState(false);
  // —— 1) ref 선언 ——
  const mapContainerRef = useRef(null);
  const addressInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoWindowRef = useRef(null);

  // —— 2) 지도 API 스크립트 로드 & 초기화 ——
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // const { maps, Service } = window.naver;
      const maps = window.naver.maps;
      const Service = maps.Service;

      // 지도 생성
      const map = new maps.Map(mapContainerRef.current, {
        center: new maps.LatLng(37.3595316, 127.1052133),
        zoom: 15,
        mapTypeControl: true,
      });
      mapInstanceRef.current = map;

      // InfoWindow 생성
      const infoWindow = new maps.InfoWindow({ anchorSkew: true });
      infoWindowRef.current = infoWindow;
      map.setCursor('pointer');

      // 3) 이벤트 바인딩: 지도 클릭 → 좌표→주소
      // map.addListener("click", (e) => {
      //   searchCoordinateToAddress(e.coord);
      // });

      // 4) 키보드(Enter) / 버튼 클릭 → 주소→좌표
      addressInputRef.current.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          searchAddressToCoordinate(addressInputRef.current.value);
        }
      });
      submitButtonRef.current.addEventListener('click', (e) => {
        e.preventDefault();
        searchAddressToCoordinate(addressInputRef.current.value);
      });

      // 5) 초기 검색
      // searchAddressToCoordinate("정자동 178-1");
      // 5) 초기 검색: input 값 세팅 후 버튼 클릭
      // if (addressInputRef.current && submitButtonRef.current) {
      //   addressInputRef.current.value = "서울 서초구 서초대로50길 82 정원빌딩";
      //   submitButtonRef.current.click();
      // }
      setLoaded(true); // 로딩 완료 표시
    };

    return () => {
      // 필요하다면 script 제거나 이벤트 정리
    };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    addressInputRef.current.value = address;
    submitButtonRef.current.click();
    // submitButtonRef.current.click();
  }, [loaded]);
  // —— 6) 헬퍼 함수들 ——
  function makeAddress(item) {
    if (!item) return '';
    const { area1, area2, area3, area4 } = item.region || {};
    let sido = area1?.name || '';
    let sigugun = area2?.name || '';
    let dongmyun = area3?.name || '';
    let ri = area4?.name || '';
    let rest = '';

    const land = item.land;
    if (land?.number1) {
      if (land.type === '2') rest += '산';
      rest += land.number1 + (land.number2 ? `-${land.number2}` : '');
      if (item.name === 'roadaddr' && land.addition0?.value) {
        rest += ' ' + land.addition0.value;
      }
    }

    // 도로명 주소 특수 처리
    if (item.name === 'roadaddr') {
      if (/면$/.test(dongmyun)) {
        ri = land.name;
      } else {
        dongmyun = land.name;
        ri = '';
      }
    }

    return [sido, sigugun, dongmyun, ri, rest].filter(Boolean).join(' ');
  }

  function searchCoordinateToAddress(latlng) {
    // const { Service, maps } = window.naver;
    const maps = window.naver.maps;
    const Service = maps.Service;
    const infoWindow = infoWindowRef.current;
    infoWindow.close();

    Service.reverseGeocode(
      {
        coords: latlng,
        orders: [Service.OrderType.ADDR, Service.OrderType.ROAD_ADDR].join(','),
      },
      (status, response) => {
        if (status === Service.Status.ERROR) {
          return alert('Something Wrong!');
        }

        const items = response.v2.results;
        const htmls = items.map((item, i) => {
          const addrType =
            item.name === 'roadaddr' ? '[도로명 주소]' : '[지번 주소]';
          return `${i + 1}. ${addrType} ${makeAddress(item)}`;
        });

        infoWindow.setContent(
          `<div style="padding:10px;min-width:200px;line-height:150%;">
             <h4 style="margin-top:5px;">검색 좌표</h4><br/>
             ${htmls.join('<br/>')}
           </div>`,
        );
        infoWindow.open(mapInstanceRef.current, latlng);
      },
    );
  }

  function searchAddressToCoordinate(address) {
    // const { Service, maps } = window.naver;
    const maps = window.naver.maps;
    const Service = maps.Service;
    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current;

    Service.geocode({ query: address }, (status, response) => {
      if (status === Service.Status.ERROR) {
        return alert('Something Wrong!');
      }
      if (response.v2.meta.totalCount === 0) {
        return alert('검색 결과가 없습니다');
      }

      const item = response.v2.addresses[0];
      const point = new maps.Point(item.x, item.y);
      const htmls = [];

      if (item.roadAddress) htmls.push(`[도로명 주소] ${item.roadAddress}`);
      if (item.jibunAddress) htmls.push(`[지번 주소] ${item.jibunAddress}`);
      if (item.englishAddress)
        htmls.push(`[영문명 주소] ${item.englishAddress}`);

      infoWindow.setContent(
        `<div style="padding:10px;min-width:200px;line-height:150%;">
           <h4 style="margin-top:5px;">검색 주소: ${address}</h4><br/>
           ${htmls.join('<br/>')}
         </div>`,
      );
      map.setCenter(point);
      infoWindow.open(map, point);
    });
  }

  // —— 7) JSX 렌더링 ——
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <input
        ref={addressInputRef}
        id='address'
        placeholder='주소를 입력하세요'
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 5,
          width: 200,
        }}
      />
      <button
        ref={submitButtonRef}
        id='submit'
        style={{ position: 'absolute', top: 10, left: 220, zIndex: 5 }}
      >
        검색
      </button>
      <div id='map' ref={mapContainerRef} style={{ width, height }} />
    </div>
  );
}
