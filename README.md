# 🏸 ShuttlePlay 프로젝트

위치 기반 + 실력 기반 자동 매칭 시스템
React (프론트엔드) + Spring Boot (백엔드) 기반의 웹 서비스 프로젝트 입니다.

## 📁 폴더 구조 안내
폴더명	설명
- [Backend](../Backend)	Spring Boot 기반 백엔드 코드
- [Frontend](../Frontend)	React 기반 프론트엔드 코드
- [Monorepo](./Monorepo) 프론트엔드(React)를 빌드하여 포함한 백엔드(Spring Boot) 통합 실행 코드


## 🚀 실행 방법
>간혹 로그인 세션이 갱신되지 않거나, 로그인 후에도 이전 화면이 유지되는 경우가 있습니다.  
이럴 때는 아래와 같이 **브라우저 캐시를 삭제한 후 새로고침** 해주세요.
#### ✅ 버전 1: 통합 프로젝트 실행 (Spring Boot로 프론트+백엔드 함께 실행)
>백엔드가 프론트엔드 build 폴더를 포함하여 통합된 상태일 때 사용
1. JDK 17 이상 설치
2. Monorepo 폴더로 이동

```
cd Backend
./gradlew bootRun
```

3. 브라우저에서 http://localhost:8080 접속

#### ✅ 버전 2: 프론트엔드와 백엔드 따로 실행

>개발 중인 환경처럼 각자 실행하고 싶은 경우
1. 백엔드 실행
```
cd Backend
./gradlew bootRun
```
기본 포트: http://localhost:8080

2. 프론트엔드 실행
```
cd Frontend
npm install
npm start
```
기본 포트: http://localhost:3000

>프론트엔드에서 API 호출 시, package.json에 프록시 설정이 되어 있어 백엔드로 요청이 연결됩니다.

#### 🔐 환경변수 (.env)
백엔드에서는 일부 민감 정보를 .env 또는 환경설정 파일로 관리합니다.<br>
예시 파일: Backend/.env
```
COOLSMS_API_KEY=your-api-key
COOLSMS_API_SECRET=your-api-secret
COOLSMS_SENDER_PHONE=01012345678
```

## 🎬 시연 영상 및 자료
발표 자료: [프로그래밍언어_최종발표](https://docs.google.com/presentation/d/1cbJLZQiRRO8jxw33259UeExzzKJIGWay9NuCx9Zs5_M/edit?usp=sharing)<br>
발표 자료 내 시연 영상을 플레이하기 위해선 권한을 요청해야 합니다.
