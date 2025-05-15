## 👥 Team Members

| [<img src="https://avatars.githubusercontent.com/yeeun-yenny" width="70" style="border-radius:50%;">](https://github.com/yeeun-yenny) | [<img src="https://avatars.githubusercontent.com/SHINHYEONGUK" width="70" style="border-radius:50%;">](https://github.com/SHINHYEONGUK) | [<img src="https://avatars.githubusercontent.com/ehgus8" width="70" style="border-radius:50%;">](https://github.com/ehgus8) | [<img src="https://avatars.githubusercontent.com/Petrushhka" width="70" style="border-radius:50%;">](https://github.com/Petrushhka) |
| :---------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
|                                               [김예은](https://github.com/yeeun-yenny)                                               |                                              [신현국](https://github.com/SHINHYEONGUK)                                              |                                             [이도현](https://github.com/ehgus8)                                             |                                              [윤하준](https://github.com/Petrushhka)                                               |

---

## ✅ 1. 기획서

### 1.1 프로젝트 개요

본 프로젝트는 사용자들이 맛집에 대한 리뷰를 작성하고, 다른 사람들의 리뷰를 열람할 수 있는 맛집 리뷰 시스템입니다. Spring 기반의 MSA 구조를 적용하여 확장성과 유지보수성을 고려하였습니다.

### 1.2 목표 및 범위

- **목표:** 사용자들이 맛집에 대한 신뢰성 있는 정보를 공유하고, 다양한 기준으로 맛집을 탐색할 수 있도록 함

- **범위:**

  - 포함: 사용자 회원가입/로그인, 맛집 등록/검색/조회/수정/삭제, 리뷰 작성/열람/수정/삭제, 평점 시스템, 포인트, 뱃지 시스템

  - 제외: 예약 기능, 배달 서비스, 실시간 채팅

### 1.3 타겟 사용자

- 일반 사용자 (음식을 좋아하는 개인)

- 지역 기반 맛집을 찾는 외식 소비자

- 리뷰 마케팅을 원하는 소상공인 (향후 관리자 서비스 확장 가능)

### 1.4 주요 기능 목록

- 사용자 등록/로그인 (JWT 인증)

- 맛집 등록/검색/조회/수정/삭제

- 키워드 및 지역 기반 맛집 검색

- 리뷰 작성/수정/삭제

- 별점 기반 평균 평점 계산

- 포인트, 뱃지 시스템

### 1.5 기술 스택

- **Backend**: Spring Boot, Spring Cloud, Spring Security, JPA

- **Frontend**: React, Axios

- **Database**: MySQL

- **Infrastructure**: AWS EC2, S3

### 1.6 마이크로서비스 구조

- 사용자 서비스

- 맛집(가게) 서비스

- 리뷰 서비스

- 포인트(뱃지) 서비스

- API 게이트웨이

- Eureka 서버

## 2. 산출물
https://first-viburnum-d12.notion.site/MSA-3-1e58b55c686780978227faec24417dd6
