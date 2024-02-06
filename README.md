# 📷chat app

[chat-app](https://github.com/YeonghunKO/chat-app-client/tree/main)의 백엔드를 관리하는 레포지토리 입니다!

## 📢 주요 기능
1. 유저 정보데이터를 저장, 관리합니다.
2. 메시지 데이터를 저장, 관리합니다.
3. access token , refresh token을 사용하여 유저의 인가를 관리합니다.
4. socket.io를 이용해 실시간으로 클라이언트 요청을 처리합니다.

## ⏳ 진행 기간
2023년 8월 01일 ~ 현재

## ⛏개선 사항
_**아래는 클론코드 강의에 없는 기능이지만 필요하다고 생각해서 제 나름대로 추가한 기능들입니다.**_

1. 현재 로그인한 유저를 class로 관리하였습니다.([onlineUsers](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/onlineUser.ts))
2. jsonwebtokens를 이용해 인가를 적용했습니다.([jwtAuth](https://github.com/YeonghunKO/chat-app-server/blob/master/middleware/jwtAuth.ts))
3. controller에서 발생하는 에러를 핸들링하였습니다.([errorHandle](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/errorHandle.ts))
4. 날짜별로 메시지를 묶어서 프론트에 넘겨주었습니다([getMessages](https://github.com/YeonghunKO/chat-app-server/blob/master/controller/MessageController.ts))
   - 이로써 프론트는 날짜별로 일일이 필터링 할 필요없어졌습니다.
5. uri 구조를 개선했습니다
   - uri 안에 있는 있는 동사(ex> get-messages)는 [http method로 대신](https://github.com/YeonghunKO/chat-app-server/commit/a64971505fcab61c3c0ea72d71cc178518466e20)하였습니다.
  
6. oracle cloud에 배포하고 nginx + certbot을 이용해 ssl을 추가하였습니다. 

## 🚀 배포

- [배포 링크](https://api.chat-app.live)

## 🤖기술 스택

### 📚&nbsp;&nbsp;Frameworkes & Libraries

- express.js
- prisma
- jsonwebtoken
- socket.io
- nginx
- certbot

## ✍️TIL
- [2주간의 삽질](https://velog.io/@yhko1992/%EC%A7%80%EB%82%9C-%ED%95%9C%EB%8B%AC%EA%B0%84-%EC%82%BD%EC%A7%88%EC%9D%98-%EA%B8%B0%EB%A1%9D)
- [http에 ssl 적용](https://velog.io/@yhko1992/http%EC%97%90-ssl%EC%A0%81%EC%9A%A9%ED%95%98%EC%97%AC-https%EB%A1%9C-%EB%A7%8C%EB%93%A4%EC%96%B4%EC%A3%BC%EA%B8%B0)
- [oracle cloud에 서버 배포](https://velog.io/@yhko1992/oracle-vc%EC%97%90%EC%84%9C-%ED%8F%AC%ED%8A%B8%EB%A5%BC-%EC%97%B4%EC%96%B4%EC%A3%BC%EA%B3%A0-%EB%B0%A9%ED%99%94%EB%B2%BD-%ED%97%88%EC%9A%A9%ED%95%98%EA%B8%B0)
- [쿠키에 대해서](https://velog.io/@yhko1992/%EC%BF%A0%ED%82%A4%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90)
- [css - transform을 사용하여 버벅거리는 현상 제거](https://velog.io/@yhko1992/%EB%B2%84%EB%B2%85%EA%B1%B0%EB%A6%AC%EB%8A%94-%ED%98%84%EC%83%81-%ED%95%B4%EA%B2%B0)

## 🔑 실행방법

.env를 만들고 아래 환경변수를 추가합니다

```cmd
PORT = 80
CLIENT_URL = http://localhost:3000

SCRETE_ACCESS = zzakdol
SCRETE_REFRESH = gongnam

DATABASE_URL="postgresql://postgres:koil132123451234@db.xpdqxuuljksmrjhubmtn.supabase.co:5432/postgres"
```


```cmd
$ npm install
$ npm run start
```
