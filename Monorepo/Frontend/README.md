# 🖥️ ShuttlePlay Frontend

이 저장소는 셔틀플레이(ShuttlePlay) 프로젝트의 프론트엔드 파트로, React 기반으로 개발되었습니다.

---

## 📦 필수 조건

- Node.js (권장 버전: 22.15.1 (LTS 버전))
- npm (Node.js 설치 시 기본 포함)

---

## 🚀 실행 방법

1. 저장소 클론

```bash
git clone https://github.com/YU-PL-25/Frontend.git
cd Frontend
```

2. 의존성 설치

```bash
npm install
```

3. 프로젝트에서 추가로 사용된 외부 라이브러리 설치

```bash
npm install axios
npm install lucide-react
npm install react-select
npm install bootstrap-icons
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
```

4. 개발 서버 실행

```bash
npm start
```

> 브라우저에서 자동으로 `http://localhost:3000`이 열립니다.

---

## 📝 커밋 메시지 작성 규칙

- 작성 방법 : ```[카테고리]``` 작업 내용 요약

|카테고리	|설명|
|--|--|
|추가|	새로운 기능 추가
|수정|	기존 기능 수정, 버그 수정
|삭제|	불필요한 내용 삭제, 기능 삭제
|문서|	코드 편집X, 관련 문서 업로드 할 때
|테스트|	테스트 코드 작업 시
|환경|	빌드, 설정 파일 등 수정, DB 연결 작업