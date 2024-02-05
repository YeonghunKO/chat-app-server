# 📷chat app

[chat-app](https://github.com/YeonghunKO/chat-app-client/tree/main)의 백엔드를 관리하는 레포지토리 입니다!

## 📢 주요 기능
1. 유저 정보데이터를 저장, 관리합니다.
2. 메시지 데이터를 저장, 관리합니다.
3. access token , refresh token을 사용하여 유저의 인가를 관리합니다.
4. socket.io를 이용해 실시간으로 클라이언트 요청을 처리합니다.

## ⏳ 진행 기간
대략적으로 2023년 8월 01일 ~ 현재
 - 백엔드 배포 도메인에 https를 추가하는 중에 있습니다. ==> https적용에 성공하였으나 cookie를 setting에 문제가 있어 nginx config를 손보는 중입니다.


## ⛏개선 사항
_**아래는 클론코드 강의에 없는 기능이지만 필요하다고 생각해서 제 나름대로 추가한 기능들입니다.**_

1. 현재 로그인한 유저를 class로 관리하였습니다.([onlineUsers](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/onlineUser.ts))
2. jsonwebtokens를 이용해 인가를 적용했습니다.([jwtAuth](https://github.com/YeonghunKO/chat-app-server/blob/master/middleware/jwtAuth.ts))
3. controller에서 발생하는 에러를 핸들링하였습니다.([errorHandle](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/errorHandle.ts))
4. 날짜별로 메시지를 묶어서 프론트에 넘겨주었습니다([getMessages](https://github.com/YeonghunKO/chat-app-server/blob/master/controller/MessageController.ts))
   - 이로써 프론트는 날짜별로 일일이 필터링 할 필요없어졌습니다.
5. uri 구조를 개선했습니다
   - uri 안에 있는 있는 동사(ex> get-messages)는 http method로 대신하였습니다.

<br>

## 🚀 배포

- [배포 링크](https://api.chat-app.live)

## 🤖기술 스택

### 📚&nbsp;&nbsp;Frameworkes & Libraries

- express.js
- prisma
- jsonwebtoken
- socket.io

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
